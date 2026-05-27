import React from "react";
import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export function FormField({ label, name, ...props }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <input
        name={name}
        className="rounded border border-slate-300 px-3 py-2"
        {...props}
      />
    </label>
  );
}
