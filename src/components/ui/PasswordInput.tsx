'use client';
import { forwardRef, InputHTMLAttributes, useState } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', id, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || rest.name || undefined;
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#33302f]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type={show ? 'text' : 'password'}
            className={
              'w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-4 py-3 pr-12 text-base outline-none transition focus:border-[#fe4f02] focus:shadow-[0_0_0_3px_rgba(254,79,2,0.1)] ' +
              className
            }
            {...rest}
          />
          <button
            type="button"
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 inline-flex h-8 w-8 items-center justify-center text-[#6c757d] transition hover:text-[#fe4f02]"
          >
            {show ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M1 10S4 4 10 4s9 6 9 6-3 6-9 6-9-6-9-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="1"
                  y1="1"
                  x2="19"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M1 10S4 4 10 4s9 6 9 6-3 6-9 6-9-6-9-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
