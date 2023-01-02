import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEventHandler } from 'react';

type Props = Omit<TextFieldProps, 'onChange'> & {
  onChange?: (value: string) => void;
};

const NumberTextField = ({ onChange, ...props }: Props) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return <TextField fullWidth inputMode="decimal" onChange={handleChange} {...props} />;
};

export default NumberTextField;
