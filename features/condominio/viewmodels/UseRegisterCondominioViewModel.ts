import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { getPersonasService } from '../../auth/services/RegisterPersonaService';
import { createAreaComunService, deleteAreaComunService, getAreasComunesService } from '../services/AreaComunService';
import {
    assignResidentService,
    createCondominioService,




    createUnidadService,
    deleteCondominioService,
    getCondominiosService
} from '../services/CondominioService';
import { AssignResidentDTO, CreateAreaComunDTO, CreateUnidadDTO, Horario } from '../types/condominio';

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
    const [condoImage, setCondoImage] = useState<string | null>(null);

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
    const [assignFechaFin, setAssignFechaFin] = useState<string>('');

    // Area Form states
    const [areaName, setAreaName] = useState<string>('');
    const [areaDescription, setAreaDescription] = useState<string>('');
    const [areaCapacity, setAreaCapacity] = useState<string>('');
    const [areaCondoId, setAreaCondoId] = useState<number | null>(null);
    const [areaHorarios, setAreaHorarios] = useState<Horario[]>([
        { horaInicio: '09:00', horaFin: '12:00' }
    ]);

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

    const areasQuery = useQuery({
        queryKey: ['common-areas'],
        queryFn: () => getAreasComunesService(),
    });

    // Mutations
    const addCondoMutation = useMutation({
        mutationFn: (formData: FormData) => createCondominioService(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condominiums'] });
            resetCondoForm();
            setShowCondoForm(false);
            Alert.alert('Condominio registrado', 'El condominio se ha registrado correctamente.');
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || error.message;
            const status = error.response?.status;
            console.error(`Error creando condominio (${status}):`, errorMsg, error.response?.data);

            let userWarning = '';
            if (status === 403) {
                userWarning = ' Verifica que tu usuario tenga permisos de ADMIN.';
            } else if (status === 400 || status === 415 || status === 500) {
                userWarning = ' Hubo un problema con el formato de los datos o la imagen.';
            }

            Alert.alert('Error', `No se pudo registrar: ${errorMsg}.${userWarning}`);
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

    const addAreaMutation = useMutation({
        mutationFn: ({ condoId, dto }: { condoId: number, dto: CreateAreaComunDTO }) => createAreaComunService(condoId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['common-areas'] });
            resetAreaForm();
            setShowAreaForm(false);
            Alert.alert('Área común registrada', 'El área se ha registrado correctamente.');
        },
        onError: (error: any) => {
            console.error("Error creating area:", error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo registrar el área común.');
        }
    });

    const deleteAreaMutation = useMutation({
        mutationFn: (id: number) => deleteAreaComunService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['common-areas'] });
            Alert.alert('Éxito', 'El área común ha sido eliminada.');
        },
        onError: (error: any) => {
            console.error("Error deleting area:", error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo eliminar el área común.');
        }
    });

    const condominiums = condosQuery.data ?? [];

    const resetCondoForm = useCallback(() => {
        setCondoName('');
        setCondoAddress('');
        setCondoUnits('');
        setCondoImage(null);
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
        setAssignFechaInicio(new Date().toISOString().split('T')[0]);
        setAssignFechaFin('');
    }, []);

    const resetAreaForm = useCallback(() => {
        setAreaName('');
        setAreaDescription('');
        setAreaCapacity('');
        setAreaCondoId(null);
        setAreaHorarios([{ horaInicio: '09:00', horaFin: '12:00' }]);
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir la imagen.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCondoImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara para tomar la foto.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCondoImage(result.assets[0].uri);
        }
    };

    const handleAddCondo = useCallback(async () => {
        if (!condoName.trim() || !condoAddress.trim()) {
            Alert.alert('Campos requeridos', 'Por favor completa nombre y dirección.');
            return;
        }

        // Construir el objeto JSON para la parte 'condominio'
        const condoJson = {
            nombre: condoName.trim(),
            direccion: condoAddress.trim(),
            totalUnidades: parseInt(condoUnits, 10) || 0,
            estado: true,
            // fechaRegis la asigna el backend automáticamente
        };

        const formData = new FormData();

        console.log("--- Iniciando Registro de Condominio ---");
        console.log("Datos del JSON:", condoJson);

        // Agregamos el JSON de forma compatible
        if (Platform.OS === 'web') {
            formData.append('condominio', new Blob([JSON.stringify(condoJson)], { type: 'application/json' }));
        } else {
            // En Móvil, Spring Boot espera el JSON pero sin Blob para mayor estabilidad
            formData.append('condominio', JSON.stringify(condoJson));
        }

        // Si hay una imagen seleccionada, la adjuntamos
        if (condoImage) {
            const uri = condoImage;
            const filename = uri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            if (Platform.OS === 'web') {
                try {
                    console.log("Detectado Web: Convirtiendo URI a Blob para archivo real...");
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    formData.append('archivo', blob, filename);
                } catch (error) {
                    console.error("Error al procesar imagen en Web:", error);
                }
            } else {
                console.log("Detectado Móvil: Adjuntando archivo al FormData:", filename, "Mime:", type);
                formData.append('archivo', {
                    uri: condoImage,
                    name: filename,
                    type: type,
                } as any);
            }
        } else {
            console.log("No se seleccionó ninguna imagen. Se enviará solo el JSON.");
        }

        console.log("Enviando petición POST a /condominios...");
        addCondoMutation.mutate(formData);
    }, [condoName, condoAddress, condoUnits, condoImage, addCondoMutation]);

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
            fechaFin: assignFechaFin.trim() || null,
            estado: true
        };

        assignPersonaMutation.mutate(dto);
    }, [selectedUnidadId, selectedPersonaId, assignRol, assignFechaInicio, assignFechaFin, assignPersonaMutation]);

    const handleAddArea = useCallback(() => {
        if (!areaCondoId) {
            Alert.alert('Error', 'Por favor selecciona un condominio.');
            return;
        }
        if (!areaName.trim() || !areaCapacity.trim()) {
            Alert.alert('Campos requeridos', 'Por favor completa nombre y capacidad.');
            return;
        }

        const dto: CreateAreaComunDTO = {
            nombre: areaName.trim(),
            descripcion: areaDescription.trim(),
            capacidad: parseInt(areaCapacity, 10) || 0,
            horarios: areaHorarios.map(h => ({
                horaInicio: h.horaInicio.length === 5 ? `${h.horaInicio}:00` : h.horaInicio,
                horaFin: h.horaFin.length === 5 ? `${h.horaFin}:00` : h.horaFin
            }))
        };

        addAreaMutation.mutate({ condoId: areaCondoId, dto });
    }, [areaCondoId, areaName, areaDescription, areaCapacity, areaHorarios, addAreaMutation]);

    const handleAddHorario = useCallback(() => {
        setAreaHorarios([...areaHorarios, { horaInicio: '09:00', horaFin: '12:00' }]);
    }, [areaHorarios]);

    const handleUpdateHorario = useCallback((index: number, field: keyof Horario, value: string) => {
        const newHorarios = [...areaHorarios];
        newHorarios[index] = { ...newHorarios[index], [field]: value };
        setAreaHorarios(newHorarios);
    }, [areaHorarios]);

    const handleRemoveHorario = useCallback((index: number) => {
        if (areaHorarios.length > 1) {
            setAreaHorarios(areaHorarios.filter((_, i) => i !== index));
        }
    }, [areaHorarios]);

    const handleDeleteArea = useCallback((id: number) => {
        Alert.alert(
            'Eliminar Área Común',
            '¿Estás seguro de que deseas eliminar esta área? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => deleteAreaMutation.mutate(id)
                }
            ]
        );
    }, [deleteAreaMutation]);

    return {
        activeTab,
        setActiveTab,
        condominiums,
        commonAreas: areasQuery.data ?? [],
        isLoading: condosQuery.isLoading || areasQuery.isLoading,
        isRefreshing: condosQuery.isFetching || areasQuery.isFetching,
        refreshCondos: () => {
            condosQuery.refetch();
            areasQuery.refetch();
        },
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
        areaName,
        setAreaName,
        areaDescription,
        setAreaDescription,
        areaCapacity,
        setAreaCapacity,
        areaCondoId,
        setAreaCondoId,
        areaHorarios,
        handleAddCondo,
        handleDeleteCondo,
        handleAddUnits,
        handleAddArea,
        handleDeleteArea,
        handleAddHorario,
        handleUpdateHorario,
        handleRemoveHorario,
        isAddingCondo: addCondoMutation.isPending,
        isAddingArea: addAreaMutation.isPending,
        isAddingUnidad: addUnidadMutation.isPending,
        isCondoFormValid: condoName.trim().length > 0 && condoAddress.trim().length > 0,
        isAreaFormValid: areaName.trim().length > 0 && areaCapacity.trim().length > 0 && areaCondoId !== null,
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
        assignFechaInicio,
        setAssignFechaInicio,
        assignFechaFin,
        setAssignFechaFin,
        // Image picking exports
        condoImage,
        pickImage,
        takePhoto,
    };
}
