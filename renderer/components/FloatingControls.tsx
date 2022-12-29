import { Box } from '@mui/system';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const FloatingControls = ({ children }: Props) => (
  <Box position="fixed" bottom="16px" right="16px">
    {children}
  </Box>
);

export default FloatingControls;
