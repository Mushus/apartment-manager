import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const List = ({ children }: Props) => <Box>{children}</Box>;

export default List;
