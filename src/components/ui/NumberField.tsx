'use client';
import * as React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string | number | undefined | null;
  onChange: (value: string) => void;
};

export default function NumberField({ value, onChange, ...rest }: Props) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
