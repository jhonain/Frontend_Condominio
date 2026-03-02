import { useAuth } from '@/context/AuthContext';
import { getPersonaByIdService } from '@/features/auth/services/RegisterPersonaService';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { getDashboardResidenteService } from '../services/DashboardService';

export function useProfileViewModel() {
  const { user, logout, isResident, isAdmin, isSecurity } = useAuth();

  // Query para Residente: Dashboard completo
  const residentDashboardQuery = useQuery({
    queryKey: ['resident-dashboard-profile', user?.id],
    queryFn: () => getDashboardResidenteService(user!.id),
    enabled: !!user?.id && isResident,
  });

  // Query para Admin/Seguridad: Datos de Persona
  const personaQuery = useQuery({
    queryKey: ['persona-profile', user?.id],
    queryFn: () => getPersonaByIdService(user!.id),
    enabled: !!user?.id && (isAdmin || isSecurity),
  });

  const handleLogout = useCallback(() => {
    console.log("UseProfileViewModel: handleLogout presionado.");

    const onConfirmLogout = async () => {
      console.log("UseProfileViewModel: Confirmado cierre de sesión, llamando a logout()...");
      await logout();
      console.log("UseProfileViewModel: logout() completado.");
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (confirmed) {
        onConfirmLogout();
      } else {
        console.log("UseProfileViewModel: Logout cancelado en web.");
      }
    } else {
      Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas cerrar sesión?', [
        { text: 'Cancelar', style: 'cancel', onPress: () => console.log("UseProfileViewModel: Logout cancelado.") },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: onConfirmLogout },
      ]);
    }
  }, [logout]);

  return {
    user,
    isResident,
    residentData: residentDashboardQuery.data,
    personaData: personaQuery.data,
    isLoading: residentDashboardQuery.isLoading || personaQuery.isLoading,
    isRefreshing: residentDashboardQuery.isRefetching || personaQuery.isRefetching,
    handleLogout,
    refresh: () => {
      if (isResident) residentDashboardQuery.refetch();
      if (isAdmin || isSecurity) personaQuery.refetch();
    },
    // Nombre para mostrar basado en el rol
    displayName: isResident
      ? residentDashboardQuery.data?.nombreCompleto
      : personaQuery.data ? `${personaQuery.data.nombre} ${personaQuery.data.apellidos}` : null,
    // Datos de la persona logueada
    nombreCompleto: isResident
      ? residentDashboardQuery.data?.nombreCompleto
      : personaQuery.data ? `${personaQuery.data.nombre} ${personaQuery.data.apellidos}` : 'Usuario'
  };
}