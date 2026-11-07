import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, AuthLink, type AuthFormValues } from "../components/AuthShell";
import { useAuth } from "../hooks/useAuth";

export function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success(res.message || "Account created successfully! Welcome to AdGen.");
      navigate("/create");
    } catch (err: any) {
      const errorMessage =
        err?.message || "Registration failed. Please check your details and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      kicker="First run is free"
      title="Make an account, make an ad."
      blurb="No card needed. Upload two photos and see what comes back."
      submitLabel="Create account"
      showName
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      footer={
        <>
          Already using AdGen? <AuthLink to="/login">Log in</AuthLink>
        </>
      }
    />
  );
}

export default Signup;
