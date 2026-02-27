import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

// Crear el cliente de React Query
const queryClient = new QueryClient();

// ─── Layout principal ───
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerBackTitle: 'Atrás' }}>
          {/* Ruta normal raíz (usa index.tsx) */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Grupo de autenticación: /(auth)/... */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Grupo de tabs protegidos: /(tabs)/... */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Modal global: /modal */}
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'fade',
            }}
          />

          {/* Not found global: /cualquier-ruta-que-no-existe */}
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
