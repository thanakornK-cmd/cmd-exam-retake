import React from "react";
import { FormField } from "@library/ui";

export function LoginForm() {
  return (
    <form className="grid gap-4">
      <FormField label="Email" name="email" type="email" />
      <FormField label="Password" name="password" type="password" />
      <button type="submit">Log in</button>
    </form>
  );
}
