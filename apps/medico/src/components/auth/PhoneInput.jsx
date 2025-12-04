import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({ value, onChange }) => {
  return (
    <PhoneInput
      country={'br'}
      value={value}
      onChange={onChange}
      inputClass="!w-full !h-10 !bg-slate-800/50 !border-slate-700 !text-white"
      buttonClass="!bg-slate-800/50 !border-slate-700 hover:!bg-slate-700/50"
      dropdownClass="!bg-slate-800 !border-slate-700"
      searchClass="!bg-slate-700 !text-white"
      specialLabel=""
    />
  );
};

export default CustomPhoneInput;