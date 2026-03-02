import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';
import { createVehiculoService, deleteVehiculoService, getAllVehiculosService, getVehiculosByPersonaService, updateVehiculoService } from '../services/VehiculoService';
import { CreateVehiculoDTO, Vehiculo } from '../types/condominio';

export function useVehiculoViewModel() {
    const { user, isAdmin, isSecurity } = useAuth();
    const queryClient = useQueryClient();

    // UI States
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingVehiculoId, setEditingVehiculoId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'PERSONAL' | 'ALL'>((isAdmin || isSecurity) ? 'ALL' : 'PERSONAL');

    // Form States
    const [tipo, setTipo] = useState('AUTO');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear().toString());
    const [color, setColor] = useState('');
    const [placa, setPlaca] = useState('');

    const vehiculosQuery = useQuery({
        queryKey: viewMode === 'ALL' ? ['all-vehiculos'] : ['vehiculos', user?.id],
        queryFn: () => viewMode === 'ALL' ? getAllVehiculosService() : getVehiculosByPersonaService(user!.id),
        enabled: !!user?.id,
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateVehiculoDTO) => createVehiculoService(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-vehiculos'] });
            queryClient.invalidateQueries({ queryKey: ['vehiculos', user?.id] });
            setShowForm(false);
            resetForm();
            Alert.alert('Éxito', 'Vehículo registrado correctamente');
        },
        onError: (error: any) => {
            console.error("Error al registrar vehículo:", error);
            Alert.alert('Error', 'No se pudo registrar el vehículo');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: number, dto: Partial<CreateVehiculoDTO> }) => updateVehiculoService(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-vehiculos'] });
            queryClient.invalidateQueries({ queryKey: ['vehiculos', user?.id] });
            setShowForm(false);
            resetForm();
            Alert.alert('Éxito', 'Vehículo actualizado correctamente');
        },
        onError: (error: any) => {
            console.error("Error al actualizar vehículo:", error);
            Alert.alert('Error', 'No se pudo actualizar el vehículo');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVehiculoService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-vehiculos'] });
            queryClient.invalidateQueries({ queryKey: ['vehiculos', user?.id] });
            Alert.alert('Eliminado', 'Vehículo eliminado');
        },
        onError: (error) => {
            console.error("Error al eliminar vehículo:", error);
            Alert.alert('Error', 'No se pudo eliminar el vehículo');
        }
    });

    const resetForm = () => {
        setTipo('AUTO');
        setMarca('');
        setModelo('');
        setAnio(new Date().getFullYear().toString());
        setColor('');
        setPlaca('');
        setEditingVehiculoId(null);
    };

    const handleSave = () => {
        if (!marca || !modelo || !placa) {
            Alert.alert('Campos requeridos', 'Por favor completa marca, modelo y placa');
            return;
        }

        const dto: CreateVehiculoDTO = {
            personaId: user!.id,
            tipo,
            marca,
            modelo,
            anio: parseInt(anio, 10),
            color,
            placa
        };

        if (editingVehiculoId) {
            updateMutation.mutate({ id: editingVehiculoId, dto });
        } else {
            createMutation.mutate(dto);
        }
    };

    const handleEdit = (vehiculo: Vehiculo) => {
        setEditingVehiculoId(vehiculo.id);
        setTipo(vehiculo.tipo);
        setMarca(vehiculo.marca);
        setModelo(vehiculo.modelo);
        setAnio(vehiculo.anio.toString());
        setColor(vehiculo.color);
        setPlaca(vehiculo.placa);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        Alert.alert('Eliminar vehículo', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate(id) }
        ]);
    };

    // Simple local filter
    const vehiculos = vehiculosQuery.data ?? [];
    const filteredVehiculos = vehiculos.filter(v =>
        v.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.nombre + " " + v.apellidos).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isFormValid = marca.length > 0 && modelo.length > 0 && placa.length > 0;

    return {
        vehiculos: filteredVehiculos,
        isLoading: vehiculosQuery.isLoading,
        isRefreshing: vehiculosQuery.isFetching,
        refetch: vehiculosQuery.refetch,
        isAdmin,
        isSecurity,
        viewMode,
        setViewMode,

        // Form states
        showForm,
        setShowForm,
        searchQuery,
        setSearchQuery,
        tipo,
        setTipo,
        marca,
        setMarca,
        modelo,
        setModelo,
        anio,
        setAnio,
        color,
        setColor,
        placa,
        setPlaca,
        editingVehiculoId,

        // Actions
        handleSave,
        handleEdit,
        handleDelete,
        resetForm,
        isSaving: createMutation.isPending || updateMutation.isPending,
        isFormValid
    };
}
