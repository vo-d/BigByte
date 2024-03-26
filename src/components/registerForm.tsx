"use client";

import { register } from "@/actions";
import { useFormState } from "react-dom";

const RegisterForm = () => {
  const [state, formAction] = useFormState<any, FormData>(register, undefined);

  return (
    <form action={formAction}>
      <input type="text" name="username" required placeholder="Username" />
      <input type="password" name="password" required placeholder="Password" />
      <input type="password" name="confirm" required placeholder="Confirm Password"/>
      <button>Register</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
};

export default RegisterForm;
