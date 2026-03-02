// features/auth/viewmodels/useGoogleAuthViewModel.ts
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { goToHome } from "../../../navigation/routes";
import { JwtPayload } from "../../../shared/interfaces";
import { configureGoogleSignin, googleSignIn } from "../services/googleAuthService";

export function useGoogleAuthViewModel() {
  const { login } = useAuth(); // igual que en useAuthViewModel

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorGoogle, setErrorGoogle] = useState<string | null>(null);

  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const onGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);
      setErrorGoogle(null);

      const data = await googleSignIn(); // { token }
      const decoded = jwtDecode<JwtPayload>(data.token);
      const rol = decoded.rol;
      const userId = decoded.userId;

      console.log("TOKEN GOOGLE:", data.token);
      console.log("ROL GOOGLE:", rol);
      console.log("USER ID GOOGLE:", userId);

      await login({
        id: userId,
        username: decoded.sub,
        roles: [rol]
      }, data.token);
      goToHome();
    } catch (e: any) {
      console.log("GOOGLE LOGIN ERROR =>", e.response?.data || e.message);
      setErrorGoogle("No se pudo iniciar sesión con Google");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return { onGoogleLogin, loadingGoogle, errorGoogle };
}
