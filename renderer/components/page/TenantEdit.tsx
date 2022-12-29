import { client } from '@/trpc/client';
import { Button, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import FloatingControls from '../FloatingControls';
import MyDatePicker from '../form/DatePicker';
import MyTextField from '../form/TextField';
import FormGroup from '../FromGroup';
import { usePrompt } from '../Prompt';
import SaveIcon from '@mui/icons-material/Save';

export type TenantEditable = {
  name: string;
  since: string | null;
  until: string | null;
};

type Apartment = {
  name: string;
};

type Room = {
  id: string;
  name: string;
};

type Props = {
  apartment: Apartment;
  room: Room;
  tenant?: {
    id?: string;
    name?: string;
    since?: string | null;
    until?: string | null;
  };
  onSave: (tenant: TenantEditable) => void;
};

const TenantEdit = ({ apartment, room, tenant, onSave }: Props) => {
  const router = useRouter();

  const [deletePrompt, deletePromptComponent] = usePrompt({ text: '入居者の情報を削除してよろしいですか？' });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSave({
      name,
      since,
      until,
    });
  };

  const handleDelete = async () => {
    const id = tenant?.id;
    if (id === undefined) {
      return;
    }
    if (await deletePrompt()) {
      await client.deleteTenant.mutate({ id });
      router.push(`/room/${room.id}/detail`);
    }
  };

  const [name, setName] = useState<string>(tenant?.name ?? '');
  const [since, setSince] = useState<string | null>(tenant?.since ?? null);
  const [until, setUntil] = useState<string | null>(tenant?.until ?? null);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Box my="32px">
          <Typography variant="h6">
            {apartment.name} / {room.name}
          </Typography>
        </Box>
        <FormGroup label="入居者名">
          <MyTextField value={name} onChange={setName} />
        </FormGroup>
        <FormGroup label="入居日">
          <MyDatePicker value={since} onChange={setSince} />
        </FormGroup>
        <FormGroup label="退去日">
          <MyDatePicker value={until} onChange={setUntil} />
        </FormGroup>
        <FloatingControls>
          <Button variant="contained" type="submit" endIcon={<SaveIcon />}>
            保存
          </Button>
        </FloatingControls>
        {tenant?.id && (
          <Button variant="contained" onClick={handleDelete}>
            削除
          </Button>
        )}
      </form>
      {deletePromptComponent}
    </Container>
  );
};

export default TenantEdit;
