
import React from 'react';
import { IMaskMixin } from 'react-imask';
import { cn } from '@/lib/utils';

const PlainInput = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm ring-offset-slate-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
PlainInput.displayName = "Input";

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <PlainInput {...props} ref={inputRef} />
));

const Input = React.forwardRef(({ maskOptions, ...props }, ref) => {
  if (maskOptions) {
    let { mask, ...rest } = maskOptions;

    if (mask === 'INTERNATIONAL_PHONE') {
      mask = [
        {
          mask: '+{55} (00) 0000-0000'
        },
        {
          mask: '+{55} (00) 00000-0000'
        },
        {
          mask: /^\+?\d{0,15}$/ // fallback for any other international number
        }
      ];
    }
    
    return <MaskedInput {...props} inputRef={ref} mask={mask} {...rest} />;
  }
  return <PlainInput {...props} ref={ref} />;
});
Input.displayName = "Input";


export { Input };
