import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useCallback, useRef, useState } from 'react';

type PromptParams = {
  title?: string;
  text: string;
  cancel?: string;
  ok?: string;
};

export const usePrompt = (): [(props: PromptParams) => Promise<boolean>, JSX.Element] => {
  const promise = useRef<(value: boolean) => void>();

  const [openProps, setOpenProps] = useState<PromptParams | null>(null);

  const handleOk = useCallback(() => {
    if (!promise.current) return;
    promise.current(true);
    promise.current = undefined;
    setOpenProps(null);
  }, [setOpenProps]);
  const handleClose = useCallback(() => {
    if (!promise.current) return;
    promise.current(false);
    promise.current = undefined;
    setOpenProps(null);
  }, [setOpenProps]);

  const prompt = useCallback(
    (props: PromptParams) => {
      if (promise.current) {
        return Promise.resolve(false);
      }
      setOpenProps(props);
      return new Promise<boolean>((resolve) => {
        promise.current = resolve;
      });
    },
    [setOpenProps],
  );

  return [
    prompt,
    <Dialog open={openProps !== null} onClose={handleClose}>
      <DialogTitle>{openProps?.title || '確認'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{openProps?.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{openProps?.cancel || 'キャンセル'}</Button>
        <Button onClick={handleOk} autoFocus>
          {openProps?.ok || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>,
  ];
};
