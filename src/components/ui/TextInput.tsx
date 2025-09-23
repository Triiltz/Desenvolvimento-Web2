'use client';
import { forwardRef, InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      className = '',
      containerClassName = '',
      labelClassName = '',
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || rest.name || undefined;
    return (
      <div className={containerClassName + ' flex flex-col gap-2'}>
        {label && (
          <label
            htmlFor={inputId}
            className={'text-sm font-medium text-[#33302f] ' + labelClassName}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={
            'rounded-xl border-2 border-[#e5e5e5] bg-white px-4 py-3 text-base outline-none transition focus:border-[#fe4f02] focus:shadow-[0_0_0_3px_rgba(254,79,2,0.1)] ' +
            className
          }
          {...rest}
        />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';
