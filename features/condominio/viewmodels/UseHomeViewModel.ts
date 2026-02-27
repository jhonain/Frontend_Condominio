// UseHomeViewModel.ts
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getCondominiosService } from '../services/CondominioService';

export function useHomeViewModel() {
    const { user, rol, isAdmin, isResident, isSecurity } = useAuth();

    const username = user?.username ?? 'Usuario';
    const firstName = username.split(' ')[0];

    const condosQuery = useQuery({
        queryKey: ['condominiums'],
        queryFn: () => getCondominiosService(),
        enabled: !!user,
    });

    const totalCondos = condosQuery.data?.length ?? 0;

    return {
        user,
        rol,
        isAdmin,
        isResident,
        isSecurity,
        username,
        firstName,
        totalCondos,
        isLoading: condosQuery.isLoading,
    };
}