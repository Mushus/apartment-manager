import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';

type Props = {
  children: ReactNode;
  title?: string;
  prev?: string;
};

const ToolbarMargin = styled(Box)(({ theme }) => theme.mixins.toolbar);

const Layout = ({ children, title, prev }: Props) => {
  const baseTitleText = '物件管理システム';
  const titleText = title === undefined ? baseTitleText : `${title} - ${baseTitleText}`;

  const pages = [
    { title: 'トップ', href: '/' },
    { title: '物件一覧', href: '/apartment' },
    { title: '入居状況', href: '/room' },
    { title: 'レシート発行', href: '/invoice' },
  ];

  return (
    <div>
      <Head>
        <title>{titleText}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              href={prev ?? ''}
              disabled={prev === undefined}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="h1" flexGrow={1}>
              {title ?? baseTitleText}
            </Typography>
            <Box display="flex" flexGrow={0}>
              {pages.map((page) => (
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  LinkComponent={Link}
                  key={page.href}
                  href={page.href}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <ToolbarMargin />
      </header>
      {children}
    </div>
  );
};

export default Layout;
