// UseReservasViewModel.ts
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { getAreasComunesService } from '../services/AreaComunService';
import { getDashboardResidenteService } from '../services/DashboardService';
import { createReservaService } from '../services/ReservaService';
import { AreaComun, CreateReservaDTO } from '../types/condominio';

type TabType = 'areas' | 'my-reservations';

export function useReservasViewModel() {
    const { user, isResident, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<TabType>('areas');
    const [selectedArea, setSelectedArea] = useState<AreaComun | null>(null);
    const [showReservaModal, setShowReservaModal] = useState<boolean>(false);

    // Por defecto reservamos para hoy (formato YYYY-MM-DD)
    const [reservaDate, setReservaDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Query para Admin: ver todas las áreas de todos los condominios
    const adminAreasQuery = useQuery({
        queryKey: ['common-areas-admin'],
        queryFn: getAreasComunesService,
        enabled: isAdmin,
    });

    // Query para Residente: ver áreas y sus reservas (Dashboard)
    const residentDashboardQuery = useQuery({
        queryKey: ['resident-dashboard-reserva', user?.id],
        queryFn: () => getDashboardResidenteService(user!.id),
        enabled: !!user?.id && isResident,
    });

    // Mutación para crear reserva
    const createReservaMutation = useMutation({
        mutationFn: (dto: CreateReservaDTO) => createReservaService(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resident-dashboard-reserva'] });
            Alert.alert('¡Reservado!', 'Tu reservación ha sido confirmada con éxito.');
            handleCloseReservaModal();
        },
        onError: (error: any) => {
            console.error("Error al reservar:", error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo realizar la reserva. Es posible que el horario ya esté ocupado.');
        }
    });

    const handleSelectArea = useCallback((area: AreaComun) => {
        setSelectedArea(area);
        setShowReservaModal(true);
    }, []);

    const handleCloseReservaModal = useCallback(() => {
        setShowReservaModal(false);
        setTimeout(() => setSelectedArea(null), 300);
    }, []);

    const handleReservar = useCallback((horarioId: number, horarioStr: string) => {
        if (!user?.id || !selectedArea) return;

        Alert.alert(
            'Confirmar Reservación',
            `¿Deseas reservar ${selectedArea.nombre} para el horario ${horarioStr}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        const dto: CreateReservaDTO = {
                            fecha: reservaDate,
                            personaId: user.id,
                            areaComunId: selectedArea.id,
                            horarioId: horarioId
                        };
                        createReservaMutation.mutate(dto);
                    }
                }
            ]
        );
    }, [user, selectedArea, reservaDate, createReservaMutation]);

    const commonAreas = isAdmin
        ? (adminAreasQuery.data ?? [])
        : (residentDashboardQuery.data?.areasComunes ?? []);

    const myReservations = residentDashboardQuery.data?.misReservas ?? [];

    return {
        activeTab,
        setActiveTab,
        commonAreas,
        myReservations,
        isLoading: adminAreasQuery.isLoading || residentDashboardQuery.isLoading || createReservaMutation.isPending,
        isRefreshing: adminAreasQuery.isFetching || residentDashboardQuery.isFetching,
        refreshAreas: () => {
            if (isAdmin) adminAreasQuery.refetch();
            if (isResident) residentDashboardQuery.refetch();
        },

        // Modal state
        selectedArea,
        showReservaModal,
        handleSelectArea,
        handleCloseReservaModal,
        handleReservar,
        reservaDate,
        setReservaDate
    };
}
