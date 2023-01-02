import { Container as MContainer, Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  mb?: string;
};

const Container = ({ children, mb }: Props) => (
  <MContainer style={{ overflow: 'hidden' }}>
    <Box my="32px" mb={mb}>
      {children}
    </Box>
  </MContainer>
);

export default Container;
