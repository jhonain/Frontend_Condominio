import { goToHome } from "@/navigation/routes";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { JwtPayload, UsuarioSession } from "../../../shared/interfaces"; // ← interfaz que creaste
import { loginService } from "../services/loginService";

export const useAuthViewModel = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await loginService(username, password);

      // ← Decodifica el JWT y extrae el rol
      const decoded = jwtDecode<JwtPayload>(token);
      const rol = decoded.rol; // "ADMIN", "RESIDENTE" o "SEGURIDAD"
      const userId = decoded.userId; // ← Extracción del ID

      console.log("TOKEN:", token);
      console.log("ROL:", rol);
      console.log("USER ID:", userId);

      // Creamos el objeto de sesión del usuario
      const userSession: UsuarioSession = {
        id: userId,
        username: username,
        roles: [rol]
      };

      await login(userSession, token); // ← ahora manda el objeto UserSession + token
      goToHome();
    } catch (e: any) {
      console.log("LOGIN ERROR =>", e.response?.data || e.message);
      setError(e.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    onLogin,
  };
};
