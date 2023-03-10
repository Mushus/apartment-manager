import { TextField as MTextField } from '@mui/material';
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
};

const DatePicker = ({ value, onChange }: Props) => {
  const [innerValue, setInnerValue] = useState<string>('');
  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(value ?? '');
    }
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = useCallback(
    (e) => {
      const value = e.target.value;
      setInnerValue(value);
      onChange(value === '' ? null : value);
    },
    [setInnerValue],
  );

  return <MTextField fullWidth type="date" value={innerValue} onChange={handleChange} />;
};

export default DatePicker;
