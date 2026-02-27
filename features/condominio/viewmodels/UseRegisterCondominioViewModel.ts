import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { getPersonasService } from '../../auth/services/RegisterPersonaService';
import {
    assignResidentService,
    createCondominioService,




    createUnidadService, // Agregado
    deleteCondominioService,
    getCondominiosService
} from '../services/CondominioService';
import { AreaComun, Condominio, AssignResidentDTO, CreateUnidadDTO } from '../types/condominio';

type TabType = 'condominiums' | 'areas';

export function useCondominioViewModel() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>('condominiums');
    const [showCondoForm, setShowCondoForm] = useState<boolean>(false);
    const [showAreaForm, setShowAreaForm] = useState<boolean>(false);
    const [viewingCondoId, setViewingCondoId] = useState<number | null>(null);

    // Form states
    const [condoName, setCondoName] = useState<string>('');
    const [condoAddress, setCondoAddress] = useState<string>('');
    const [condoUnits, setCondoUnits] = useState<string>('');

    // Unidad Form states
    const [showUnidadForm, setShowUnidadForm] = useState<boolean>(false);
    const [selectedCondoId, setSelectedCondoId] = useState<number | null>(null);
    const [unidadCodigo, setUnidadCodigo] = useState<string>('');
    const [unidadPiso, setUnidadPiso] = useState<string>('');
    const [unidadArea, setUnidadArea] = useState<string>('');
    const [unidadPrecio, setUnidadPrecio] = useState<string>('');

    // Assignment Form states
    const [showAssignForm, setShowAssignForm] = useState<boolean>(false);
    const [selectedUnidadId, setSelectedUnidadId] = useState<number | null>(null);
    const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
    const [assignRol, setAssignRol] = useState<string>('Inquilino');
    const [assignFechaInicio, setAssignFechaInicio] = useState<string>(new Date().toISOString().split('T')[0]);

    // Queries
    const condosQuery = useQuery({
        queryKey: ['condominiums'],
        queryFn: () => getCondominiosService(),
    });

    const personasQuery = useQuery({
        queryKey: ['personas'],
        queryFn: () => getPersonasService(),
        enabled: showAssignForm, // Cargar solo si se abre el form
    });

    // Mutations
    const addCondoMutation = useMutation({
        mutationFn: (condo: Condominio) => createCondominioService(condo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condominiums'] });
            resetCondoForm();
            setShowCondoForm(false);
            Alert.alert('Condominio registrado', 'El condominio se ha registrado correctamente.');
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("Error creating condo (403?):", errorMsg, error.response?.data);
            Alert.alert('Error', `No se pudo registrar: ${errorMsg}. Verifica que tu usuario tenga permisos de ADMIN.`);
        }
    });

    const deleteCondoMutation = useMutation({
        mutationFn: (condoId: number) => deleteCondominioService(condoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condominiums'] });
            Alert.alert('Eliminado', 'El condominio ha sido eliminado.');
        },
        onError: (error) => {
            console.error("Error deleting condo:", error);
            Alert.alert('Error', 'No se pudo eliminar el condominio.');
        }
    });

    const addUnidadMutation = useMutation({
        mutationFn: (dto: CreateUnidadDTO) => createUnidadService(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condominiums'] });
            resetUnidadForm();
            setShowUnidadForm(false);
            Alert.alert('Unidad registrada', 'La unidad se ha registrado correctamente.');
        },
        onError: (error: any) => {
            console.error("Error creating unidad:", error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo registrar la unidad.');
        }
    });

    const assignPersonaMutation = useMutation({
        mutationFn: (dto: AssignResidentDTO) => assignResidentService(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condominiums'] });
            setShowAssignForm(false);
            resetAssignForm();
            Alert.alert('Asignación exitosa', 'La persona ha sido asignada a la unidad.');
        },
        onError: (error: any) => {
            console.error("Error assigning persona:", error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo realizar la asignación.');
        }
    });

    const condominiums = condosQuery.data ?? [];

    const resetCondoForm = useCallback(() => {
        setCondoName('');
        setCondoAddress('');
        setCondoUnits('');
    }, []);

    const resetUnidadForm = useCallback(() => {
        setUnidadCodigo('');
        setUnidadPiso('');
        setUnidadArea('');
        setUnidadPrecio('');
        setSelectedCondoId(null);
    }, []);

    const resetAssignForm = useCallback(() => {
        setSelectedPersonaId(null);
        setSelectedUnidadId(null);
        setAssignRol('Inquilino');
    }, []);

    const handleAddCondo = useCallback(() => {
        if (!condoName.trim() || !condoAddress.trim()) {
            Alert.alert('Campos requeridos', 'Por favor completa nombre y dirección.');
            return;
        }

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Adapt logic to match Condominio interface
        const newCondo: any = {
            nombre: condoName.trim(),
            direccion: condoAddress.trim(),
            totalUnidades: parseInt(condoUnits, 10) || 0,
            estado: true,
            fechaRegis: formattedDate,
            imagenUrl: null,
            unidades: []
        };

        console.log("Intentando registrar condominio:", newCondo);
        addCondoMutation.mutate(newCondo);
    }, [condoName, condoAddress, condoUnits, addCondoMutation]);

    const handleDeleteCondo = useCallback(
        (condoId: number) => {
            if (Platform.OS === 'web') {
                const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este condominio?');
                if (confirmed) {
                    deleteCondoMutation.mutate(condoId);
                }
                return;
            }

            Alert.alert('Eliminar condominio', '¿Estás seguro?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteCondoMutation.mutate(condoId) },
            ]);
        },
        [deleteCondoMutation]
    );

    const handleAddUnits = useCallback((condoId: number) => {
        setSelectedCondoId(condoId);
        setShowUnidadForm(true);
    }, []);

    const handleSelectCondo = useCallback((id: number | null) => {
        setViewingCondoId(id);
    }, []);

    const selectedCondo = condominiums.find(c => c.id === viewingCondoId) || null;

    const handleCreateUnidad = useCallback(() => {
        if (!selectedCondoId) return;
        if (!unidadCodigo.trim() || !unidadPiso.trim() || !unidadArea.trim() || !unidadPrecio.trim()) {
            Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
            return;
        }

        const dto: CreateUnidadDTO = {
            condominioId: selectedCondoId,
            codigo: unidadCodigo.trim(),
            piso: parseInt(unidadPiso, 10) || 0,
            areaM2: parseFloat(unidadArea) || 0,
            precioMensual: parseFloat(unidadPrecio) || 0,
            imagenUrl: null
        };

        addUnidadMutation.mutate(dto);
    }, [selectedCondoId, unidadCodigo, unidadPiso, unidadArea, unidadPrecio, addUnidadMutation]);

    const handleOpenAssign = useCallback((unidadId: number) => {
        setSelectedUnidadId(unidadId);
        setShowAssignForm(true);
    }, []);

    const handleAssignPersona = useCallback(() => {
        if (!selectedUnidadId || !selectedPersonaId) {
            Alert.alert('Error', 'Por favor selecciona una persona.');
            return;
        }

        const dto: AssignResidentDTO = {
            personaId: selectedPersonaId,
            unidadId: selectedUnidadId,
            rol: assignRol,
            fechaInicio: assignFechaInicio,
            fechaFin: null,
            estado: true
        };

        assignPersonaMutation.mutate(dto);
    }, [selectedUnidadId, selectedPersonaId, assignRol, assignFechaInicio, assignPersonaMutation]);

    // Placeholder functions for areas since user said "por el momento solo condominio"
    const handleAddArea = () => { };
    const handleDeleteArea = (id: number) => { };
    const resetAreaForm = () => { };

    return {
        activeTab,
        setActiveTab,
        condominiums,
        commonAreas: [] as AreaComun[],
        isLoading: condosQuery.isLoading,
        isRefreshing: condosQuery.isFetching, // Capturamos si se está recargando
        refreshCondos: condosQuery.refetch,   // Función manual para recargar
        showCondoForm,
        setShowCondoForm,
        showAreaForm,
        setShowAreaForm,
        condoName,
        setCondoName,
        condoAddress,
        setCondoAddress,
        condoUnits,
        setCondoUnits,
        condoBuildings: '',
        setCondoBuildings: () => { },
        areaName: '',
        setAreaName: () => { },
        areaDescription: '',
        setAreaDescription: () => { },
        areaCapacity: '',
        setAreaCapacity: () => { },
        handleAddCondo,
        handleDeleteCondo,
        handleAddUnits, // Agregado
        handleAddArea,
        handleDeleteArea,
        isAddingCondo: addCondoMutation.isPending,
        isAddingArea: false,
        isAddingUnidad: addUnidadMutation.isPending,
        isCondoFormValid: condoName.trim().length > 0 && condoAddress.trim().length > 0,
        isAreaFormValid: false,
        isUnidadFormValid: unidadCodigo.trim().length > 0 && unidadPiso.trim().length > 0 && unidadArea.trim().length > 0 && unidadPrecio.trim().length > 0,
        resetCondoForm,
        resetUnidadForm,
        resetAreaForm,

        // Unidad exports
        showUnidadForm,
        setShowUnidadForm,
        unidadCodigo,
        setUnidadCodigo,
        unidadPiso,
        setUnidadPiso,
        unidadArea,
        setUnidadArea,
        unidadPrecio,
        setUnidadPrecio,
        handleCreateUnidad,

        // Detail handling
        selectedCondo,
        handleSelectCondo,

        // Assignment exports
        showAssignForm,
        setShowAssignForm,
        personas: personasQuery.data ?? [],
        isLoadingPersonas: personasQuery.isLoading,
        selectedPersonaId,
        setSelectedPersonaId,
        assignRol,
        setAssignRol,
        handleOpenAssign,
        handleAssignPersona,
        isAssigning: assignPersonaMutation.isPending,
    };
}
