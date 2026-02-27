import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RolType } from "../shared/interfaces"; // ← interfaz que creaste
import { UsuarioSession } from "../shared/interfaces";
import { goToLogin } from "@/navigation/routes";

// 1. Tipos
type AuthContextType = {
  user: UsuarioSession | null;
  token: string | null;
  rol: RolType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isResident: boolean;
  isSecurity: boolean;
  login: (user: UsuarioSession, token: string) => Promise<void>;
  logout: () => Promise<void>;

};

// 2. Crear el contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  rol: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isResident: false,
  isSecurity: false,
  login: async () => {},
  logout: async () => {},
});

// 3. Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<RolType | null>(null); // ← nuevo
  const [isLoading, setIsLoading] = useState(true);

  // Al arrancar la app, carga token Y rol guardados
  useEffect(() => {
const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("jwt_token");
        const savedUser = await AsyncStorage.getItem("jwt_user");
        const savedRol = await AsyncStorage.getItem("jwt_rol");

        if (savedToken) setToken(savedToken);
        if (savedRol) setRol(savedRol as RolType);
        if (savedUser) setUser(JSON.parse(savedUser) as UsuarioSession);
      } catch (e) {
        console.error("Error cargando sesión", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // Guardar token + rol al hacer login
  const login = async (loggedUser: UsuarioSession, newToken: string) => {
    await AsyncStorage.setItem("jwt_token", newToken);
    await AsyncStorage.setItem("jwt_rol", loggedUser.roles[0]); // el primer rol
    await AsyncStorage.setItem("jwt_user", JSON.stringify(loggedUser));

    setToken(newToken);
    setRol(loggedUser.roles[0]);
    setUser(loggedUser);
  };

  // Borrar token + rol al hacer logout
  const logout = async () => {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("jwt_rol");
    await AsyncStorage.removeItem("jwt_user");
    setToken(null);
    setRol(null);
    setUser(null);
    goToLogin();
  };

  const isAuthenticated = !!token && !!user;
  const role = (rol ?? user?.roles[0]) as RolType | null;
  const isAdmin = role === "ADMIN";
  const isResident = role === "RESIDENTE";
  const isSecurity = role === "SEGURIDAD";

 return (
    <AuthContext.Provider
      value={{
        user,
        token,
        rol: role,
        isLoading,
        isAuthenticated,
        isAdmin,
        isResident,
        isSecurity,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook
export const useAuth = () => useContext(AuthContext);
