import { ChangeEventHandler, Dispatch, FormEventHandler, useCallback, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import { SortableContainer, SortableElement, SortEndHandler } from 'react-sortable-hoc';
import z from 'zod';
import { uniqueId } from 'lodash';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { client, nextClient } from '@/trpc';
import { usePrompt } from '@/components/Prompt';
import { Box, Button, Input } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MyTextField from '@/components/form/TextField';
import FormGroup from '@/components/FromGroup';
import { SetStateAction } from 'react';
import FloatingControls from '@/components/FloatingControls';
import { Apartment, Room as ORoom } from '@prisma/client';
import Container from '@/components/Container';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';

type Room = Omit<ORoom, 'id' | 'apartmentId'> & { id: ORoom['id'] | null; key: string };

type Props = {
  apartment: Apartment;
  rooms: Room[];
};

type UpdateRoomHandler = (key: string, room: Partial<Room>) => void;
type DeleteRoomHandler = (key: string) => void;

type RoomsContainerProps = {
  rooms: Room[];
  onUpdateRoom: UpdateRoomHandler;
  onDeleteRoom: DeleteRoomHandler;
};

type RoomElementProps = {
  room: Room;
  onUpdateRoom: UpdateRoomHandler;
  onDeleteRoom: DeleteRoomHandler;
};

const useObjectState = <T, K extends keyof T>(setState: Dispatch<SetStateAction<T>>, key: K) => {
  return useCallback((value: T[K]) => setState((a) => ({ ...a, [key]: value })), [setState]);
};

const Edit = ({ apartment: defaultApartment, rooms: defaultRooms }: Props) => {
  const router = useRouter();
  const [apartment, setApartment] = useState(defaultApartment);
  const [rooms, setRooms] = useState(defaultRooms);

  const handleChangeName = useObjectState(setApartment, 'name');

  const handleSort: SortEndHandler = useCallback(
    ({ oldIndex, newIndex }) => setRooms((r) => arrayMoveImmutable(r, oldIndex, newIndex)),
    [setApartment],
  );

  const handleUpdateRoom: UpdateRoomHandler = useCallback(
    (key, room) => {
      setRooms((rooms) => {
        const index = rooms.findIndex((room) => room.key === key);
        if (index === -1) return rooms;
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], ...room };
        return newRooms;
      });
    },
    [setApartment],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      (async () => {
        await client.apartment.update.mutate({ ...apartment, rooms });
        router.push('/apartment');
      })();
    },
    [rooms, apartment],
  );

  const [prompt, promptComponent] = usePrompt();

  const handleDelete = useCallback(async () => {
    if (await prompt({ text: 'マンションを削除してよろしいですか？' })) {
      await client.apartment.delete.mutate({ apartmentId: apartment.id });
      router.push('/apartment');
    }
  }, [apartment.id]);

  const handleAddRoom = useCallback(() => {
    setRooms((r) => [...r, { key: uniqueId('room'), id: null, name: '' }]);
  }, [setApartment]);

  const handleRemoveRoom: DeleteRoomHandler = useCallback(
    (key) => {
      setRooms((r) => {
        const index = r.findIndex((room) => room.key === key);
        if (index === -1) return r;
        const rooms = [...r];
        rooms.splice(index, 1);
        return rooms;
      });
    },
    [setApartment],
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormGroup label="名前">
          <MyTextField value={apartment.name} onChange={handleChangeName} />
        </FormGroup>
        <Box mb="8">
          <RoomsContainer
            rooms={rooms}
            onSortEnd={handleSort}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleRemoveRoom}
          />
          <Button onClick={handleAddRoom}>部屋追加</Button>
        </Box>
        <Button onClick={handleDelete}>削除</Button>
        <FloatingControls>
          <Button variant="contained" type="submit" endIcon={<SaveIcon />}>
            保存
          </Button>
        </FloatingControls>
      </form>
      {promptComponent}
    </Container>
  );
};

const RoomsContainer = SortableContainer<RoomsContainerProps>(
  ({ rooms, onUpdateRoom, onDeleteRoom }: RoomsContainerProps) => {
    return (
      <Box>
        {rooms.map((room, index) => (
          <RoomElement
            key={room.key}
            room={room}
            index={index}
            onUpdateRoom={onUpdateRoom}
            onDeleteRoom={onDeleteRoom}
          />
        ))}
      </Box>
    );
  },
);

const RoomElement = SortableElement<RoomElementProps>(({ room, onUpdateRoom, onDeleteRoom }: RoomElementProps) => {
  const handleUpdateName: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onUpdateRoom(room.key, { name: e.target.value });
    },
    [onUpdateRoom, room.key],
  );

  const handleDeleteRoom = useCallback(() => {
    onDeleteRoom(room.key);
  }, [onDeleteRoom, room.key]);

  return (
    <Box>
      <Button onClick={handleDeleteRoom}>削除</Button>
      <Box mb="2">部屋名</Box>
      <Input value={room.name} onChange={handleUpdateName} />
    </Box>
  );
});

export default configurePage({
  query: z.object({ apartmentId: z.string() }),
  layout: ({ children }) => (
    <Layout title="アパート編集" prev="/apartment">
      {children}
    </Layout>
  ),
  page: ({ query }) => {
    const { data: apartment } = query && nextClient.apartment.get.useQuery(query);
    const rooms = apartment?.rooms.map((r) => ({ ...r, key: uniqueId('room-server') }));
    return apartment && rooms ? <Edit apartment={apartment} rooms={rooms} /> : <Loading />;
  },
});
