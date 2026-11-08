import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "../src/hooks/useAuth";

import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import CreateAd from "./pages/CreateAd";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<CreateAd />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="bottom-right" theme="dark" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
