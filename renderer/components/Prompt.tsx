
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useCallback, useRef, useState } from 'react';

type UsePromptParams = {
  title?: string;
  text: string;
  cancel?: string;
  ok?: string;
};

export const usePrompt = ({ title, text, cancel, ok }: UsePromptParams): [() => Promise<boolean>, JSX.Element] => {
  const promise = useRef<(value: boolean) => void>();

  const [isOpen, setOpen] = useState(false);
  const cancelRef = useRef(null);

  const handleOk = useCallback(() => {
    if (!promise.current) return;
    promise.current(true);
    promise.current = undefined;
    setOpen(false);
  }, [setOpen]);
  const handleClose = useCallback(() => {
    if (!promise.current) return;
    promise.current(false);
    promise.current = undefined;
    setOpen(false);
  }, [setOpen]);

  const prompt = useCallback(() => {
    if (promise.current) {
      return Promise.resolve(false);
    }
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      promise.current = resolve;
    });
  }, [setOpen]);

  return [
    prompt,
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title || '確認'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancel || 'キャンセル'}</Button>
        <Button onClick={handleClose} autoFocus>
          {ok || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>,
  ];
};
