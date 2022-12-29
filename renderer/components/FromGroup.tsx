import { Box } from '@mui/system';
import { ReactNode } from 'react';

type Props = {
  label: string;
  children?: ReactNode;
};

const FormGroup = ({ label, children }: Props) => {
  return (
    <Box mb="16px">
      <Box mb="4px">{label}</Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default FormGroup;
