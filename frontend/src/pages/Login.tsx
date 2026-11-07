import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, AuthLink, type AuthFormValues } from "../components/AuthShell";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });

      toast.success(res.message || "Welcome back to AdGen!");
      navigate("/create");
    } catch (err: any) {
      const errorMessage = err?.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      kicker="Welcome back"
      title="Pick up where the render stopped."
      blurb="Your runs, presets and exports are waiting."
      submitLabel="Log in"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      footer={
        <>
          New here? <AuthLink to="/signup">Create an account</AuthLink>
        </>
      }
    />
  );
}

export default Login;
