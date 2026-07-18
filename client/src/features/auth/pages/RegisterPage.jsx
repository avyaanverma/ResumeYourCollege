import { redirect, useActionData } from "react-router-dom";
import { store } from "../../../app/store";
import { register } from "../authApi";
import { setSession } from "../authSlice";
import { getApiError } from "../../../shared/api/http";
import AuthForm from "../components/AuthForm";

export async function registerAction({ request }) {
  const data = Object.fromEntries(await request.formData());

  try {
    const session = await register(data);

    store.dispatch(setSession(session));

    return redirect("/dashboard");
  } catch (error) {
    return {
      error: getApiError(error),
    };
  }
}

export default function RegisterPage() {
  return <AuthForm mode="register" error={useActionData()?.error} />;
}