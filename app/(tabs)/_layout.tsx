import { Tabs } from "expo-router";
import { Home, CreditCard, CalendarDays, Bell, User, LayoutDashboard, Building2, Car } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/constants/Colors";

export default function TabLayout() {

  const { rol } = useAuth();

  const isAdmin = rol === 'ADMIN';
  const isResident = rol === 'RESIDENTE';
  const isSecurity = rol === 'SEGURIDAD';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 70,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: isAdmin ? "Dashboard" : "Inicio",
          tabBarIcon: ({ color, size }) =>
            isAdmin ? <LayoutDashboard color={color} size={size} /> : <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="condominiums"
        options={{
          title: "Condominios",
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />,
          href: isAdmin ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Pagos",
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
          href: (isAdmin || isResident) ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
          href: isResident ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="vehicles"
        options={{
          title: "Vehículos",
          tabBarIcon: ({ color, size }) => <Car color={color} size={size} />,
          href: isSecurity ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
