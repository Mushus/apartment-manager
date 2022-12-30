import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEventHandler } from 'react';

type Props = Omit<TextFieldProps, 'onChange'> & {
  onChange?: (value: string) => void;
};

const MyTextField = ({ onChange, ...props }: Props) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return <TextField fullWidth onChange={handleChange} {...props} />;
};

export default MyTextField;
