import { Button } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = Parameters<typeof Button>[0] & { children: ReactNode };

const ButtonLink = ({ children, ...props }: Props) => {
  return (
    <Button LinkComponent={Link} variant="contained" {...props}>
      {children}
    </Button>
  );
};

export default ButtonLink;
