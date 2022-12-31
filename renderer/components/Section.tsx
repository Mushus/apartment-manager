import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children?: ReactNode;
};

const Section = ({ title, children }: Props) => (
  <Box>
    <Typography variant="h6" component="h2">
      {title}
    </Typography>
    <Box mb="32px">{children}</Box>
  </Box>
);

export default Section;
