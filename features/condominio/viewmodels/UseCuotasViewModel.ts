import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';
import { getAllCuotasService, getMisCuotasService, pagarCuotaService } from '../services/CuotasService';
import { MetodoPago, PagarCuotaDTO } from '../types/condominio';

export function useCuotasViewModel() {
    const { user, isAdmin } = useAuth();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    // Payment Form States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCuotaId, setSelectedCuotaId] = useState<number | null>(null);
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('TRANSFERENCIA');
    const [observacion, setObservacion] = useState('Pago via app');

    // Si es Admin, trae todas. Si no, trae las del usuario.
    const cuotasQuery = useQuery({
        queryKey: isAdmin ? ['all-cuotas'] : ['mis-cuotas', user?.id],
        queryFn: () => isAdmin ? getAllCuotasService() : getMisCuotasService(user!.id),
        enabled: !!user?.id,
    });

    const pagarMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number, dto: PagarCuotaDTO }) => pagarCuotaService(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: isAdmin ? ['all-cuotas'] : ['mis-cuotas', user?.id] });
            setShowPaymentModal(false);
            Alert.alert('Éxito', 'El pago ha sido registrado correctamente.');
            setObservacion('Pago via app');
            setMetodoPago('TRANSFERENCIA');
        },
        onError: (error: any) => {
            console.error("Error al pagar cuota:", error);
            Alert.alert('Error', 'No se pudo registrar el pago. Intente de nuevo.');
        }
    });

    const cuotas = cuotasQuery.data ?? [];

    // Filtrado por nombre de persona (para Admin) o cualquier criterio local
    const filteredCuotas = cuotas.filter(cuota => {
        const fullName = `${cuota.nombreResidente || ''} ${cuota.apellidosResidente || ''}`.trim().toLowerCase();
        const personaMatch = fullName.includes(searchQuery.toLowerCase());
        const unidadMatch = cuota.unidadCodigo?.toLowerCase().includes(searchQuery.toLowerCase());
        const estadoMatch = cuota.estado.toLowerCase().includes(searchQuery.toLowerCase());

        return personaMatch || unidadMatch || estadoMatch || searchQuery === '';
    });

    const handleOpenPayment = (id: number) => {
        setSelectedCuotaId(id);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = () => {
        if (!selectedCuotaId) return;
        pagarMutation.mutate({
            id: selectedCuotaId,
            dto: { metodoPago, observacion }
        });
    };

    return {
        isAdmin,
        cuotas: filteredCuotas,
        isLoading: cuotasQuery.isLoading,
        isError: cuotasQuery.isError,
        refetch: cuotasQuery.refetch,
        searchQuery,
        setSearchQuery,
        // Payment modal
        showPaymentModal,
        setShowPaymentModal,
        metodoPago,
        setMetodoPago,
        observacion,
        setObservacion,
        handleOpenPayment,
        handleConfirmPayment,
        isPaying: pagarMutation.isPending,
    };
}
