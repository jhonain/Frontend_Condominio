import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import React from "react";

export default function PaymentsLayout() {
  const { isAdmin } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: isAdmin ? "Gestión de Cuotas" : "Mis Cuotas",
        }}
      />
    </Stack>
  );
}