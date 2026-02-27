import { Stack } from "expo-router";
import React from "react";

import Colors from "@/constants/Colors";

export default function PaymentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Mis Pagos",
        }}
      />
    </Stack>
  );
}