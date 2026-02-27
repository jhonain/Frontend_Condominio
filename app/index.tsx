// app/index.tsx
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { token, rol, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token || !rol) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (rol) {
    case 'RESIDENTE':
      return <Redirect href="/(tabs)/(home)" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
