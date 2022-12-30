import { Container as MContainer, Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const Container = ({ children }: Props) => (
  <MContainer>
    <Box my="32px">{children}</Box>
  </MContainer>
);

export default Container;
