import { TextField as MTextField, TextFieldProps } from '@mui/material';
import { ChangeEventHandler } from 'react';

type Props = Omit<TextFieldProps, 'onChange'> & {
  onChange?: (value: string) => void;
};

const TextField = ({ onChange, ...props }: Props) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return <MTextField fullWidth onChange={handleChange} {...props} />;
};

export default TextField;
