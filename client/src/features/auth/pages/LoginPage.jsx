import { redirect, useActionData } from "react-router";
import { store } from "../../../app/store";
import { login } from "../authApi";
import { setSession } from "../authSlice";
import { getApiError } from "../../../shared/api/http";
import AuthForm from "../components/AuthForm";

export async function loginAction({ request }) {
  const data = Object.fromEntries(await request.formData());

  try {
    const session = await login(data);

    store.dispatch(setSession(session));

    return redirect("/dashboard");
  } catch (error) {
    return {
      error: getApiError(error),
    };
  }
}

export default function LoginPage() {
  return <AuthForm mode="login" error={useActionData()?.error} />;
}
