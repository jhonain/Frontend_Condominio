// UseHomeViewModel.ts
import { useAuth } from '@/context/AuthContext';
import { getPersonaByIdService } from '@/features/auth/services/RegisterPersonaService';
import { useQuery } from '@tanstack/react-query';
import { getAvisosService } from '../services/AvisosService';
import { getCondominiosService } from '../services/CondominioService';
import { getAllCuotasService, getMisCuotasService } from '../services/CuotasService';
import { getDashboardResidenteService } from '../services/DashboardService';
import { getAllVehiculosService } from '../services/VehiculoService';
import { Cuota } from '../types/condominio';

export function useHomeViewModel() {
    const { user, rol, isAdmin, isResident, isSecurity } = useAuth();

    const username = user?.username ?? 'Usuario';
    const firstName = username.split(' ')[0];

    // Query para Admin: ver todos los condominios
    const condosQuery = useQuery({
        queryKey: ['condominiums'],
        queryFn: getCondominiosService,
        enabled: !!user && isAdmin,
    });

    // Query para Residente: ver su información completa de dashboard
    const residentDashboardQuery = useQuery({
        queryKey: ['resident-dashboard', user?.id],
        queryFn: () => getDashboardResidenteService(user!.id),
        enabled: !!user?.id && isResident,
    });

    // Query para obtener cuotas del residente
    const myCuotasQuery = useQuery({
        queryKey: ['my-cuotas', user?.id],
        queryFn: () => getMisCuotasService(user!.id),
        enabled: !!user?.id && isResident,
    });

    // Query para Avisos (Admin y Seguridad)
    const avisosQuery = useQuery({
        queryKey: ['avisos-latest'],
        queryFn: getAvisosService,
        enabled: !!user && (isAdmin || isSecurity || isResident),
    });

    // Query para Vehículos (Seguridad y Admin ven el total)
    const vehiculosQuery = useQuery({
        queryKey: ['vehiculos-all'],
        queryFn: getAllVehiculosService,
        enabled: !!user && (isSecurity || isAdmin),
    });

    // Query para obtener nombre real (Admin y Seguridad)
    const personaQuery = useQuery({
        queryKey: ['persona-home', user?.id],
        queryFn: () => getPersonaByIdService(user!.id),
        enabled: !!user?.id && (isAdmin || isSecurity),
    });

    // Query para Admin: ver todas las cuotas del sistema
    const allCuotasQuery = useQuery({
        queryKey: ['all-cuotas'],
        queryFn: getAllCuotasService,
        enabled: !!user && isAdmin,
    });

    const totalCondos = condosQuery.data?.length ?? 0;
    const totalVehiculos = vehiculosQuery.data?.length ?? 0;

    const totalRecaudado = allCuotasQuery.data
        ?.filter((c: Cuota) => c.estado === 'PAGADO')
        .reduce((sum: number, c: Cuota) => sum + (c.monto || 0), 0) ?? 0;

    const totalPendingPayments = allCuotasQuery.data
        ?.filter((c: Cuota) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO').length ?? 0;

    // Adaptamos para compatibilidad con la UI actual
    const myResidency = residentDashboardQuery.data ? {
        condominio: residentDashboardQuery.data.condominio,
        unidad: residentDashboardQuery.data.unidad
    } : null;

    const displayedName = isResident
        ? (residentDashboardQuery.data?.nombre || firstName)
        : (personaQuery.data?.nombre || firstName);

    const pendingCuota = myCuotasQuery.data?.find(c => c.estado === 'PENDIENTE' || c.estado === 'VENCIDO');
    const paidCuotasCount = myCuotasQuery.data?.filter(c => c.estado === 'PAGADO').length ?? 0;
    const reservationsCount = residentDashboardQuery.data?.misReservas?.length ?? 0;

    return {
        user,
        rol,
        isAdmin,
        isResident,
        isSecurity,
        username,
        firstName: displayedName,
        totalCondos,
        totalVehiculos,
        totalRecaudado,
        totalPendingPayments,
        myResidency,
        residentData: residentDashboardQuery.data,
        avisos: avisosQuery.data ?? [],
        pendingCuota,
        paidCuotasCount,
        reservationsCount,
        isLoading: condosQuery.isLoading || residentDashboardQuery.isLoading || avisosQuery.isLoading || personaQuery.isLoading || myCuotasQuery.isLoading || allCuotasQuery.isLoading,
        refresh: () => {
            if (isAdmin) {
                condosQuery.refetch();
                allCuotasQuery.refetch();
            }
            if (isResident) {
                residentDashboardQuery.refetch();
                myCuotasQuery.refetch();
            }
            avisosQuery.refetch();
        }
    };
}

