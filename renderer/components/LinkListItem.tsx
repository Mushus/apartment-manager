import React, { ReactNode } from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import { Box } from '@mui/material';

type Props = {
  href: string | UrlObject;
  children: ReactNode;
};

const LinkListItem = ({ href, children }: Props) => (
  <Link href={href}>
    <Box>
      {children}
    </Box>
  </Link>
);

export default LinkListItem;
