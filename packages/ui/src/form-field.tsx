import React from "react";
import type { CSSProperties, InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  hint?: string;
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#0f172a",
};

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.8)",
  background: "rgba(255, 255, 255, 0.94)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  outline: "none",
};

export function FormField({ label, name, hint, ...props }: FormFieldProps) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input
        name={name}
        style={inputStyle}
        {...props}
      />
      {hint ? (
        <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 400 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
