import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Controls = ({ children }: Props) => (
  <Box display="flex" flexDirection="row" justifyContent="flex-end" gap="8px">
    {children}
  </Box>
);

export default Controls;
