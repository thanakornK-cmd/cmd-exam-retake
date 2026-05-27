import React from "react";
import { FormField } from "@library/ui";

export function SignupForm() {
  return (
    <form className="grid gap-4">
      <FormField label="Name" name="name" />
      <FormField label="Email" name="email" type="email" />
      <FormField label="Phone" name="phone" />
      <FormField label="Password" name="password" type="password" />
      <button type="submit">Create account</button>
    </form>
  );
}
