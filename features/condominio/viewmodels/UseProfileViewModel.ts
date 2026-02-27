import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/context/AuthContext';

export function useProfileViewModel() {
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  return {
    user,
    handleLogout,
  };
}