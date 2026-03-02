import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createAvisoService, getAvisosService } from '../services/AvisosService';
import { CreateAvisoDTO, TipoAviso } from '../types/condominio';

export function useAvisosViewModel() {
    const { isAdmin, isResident, isSecurity, user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedTipo, setSelectedTipo] = useState<TipoAviso | 'TODOS'>('TODOS');
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Form state for creating a new notice
    const [newAviso, setNewAviso] = useState<CreateAvisoDTO>({
        titulo: '',
        descripcion: '',
        TipoAviso: 'GENERAL',
        importante: false,
    });

    // Fetching notices
    const avisosQuery = useQuery({
        queryKey: ['avisos'],
        queryFn: getAvisosService,
        enabled: !!user,
    });

    // Filtering notices
    const filteredAvisos = avisosQuery.data?.filter(aviso => {
        if (selectedTipo === 'TODOS') return true;
        return aviso.TipoAviso === selectedTipo;
    }) ?? [];

    // Creating a new notice
    const createAvisoMutation = useMutation({
        mutationFn: createAvisoService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avisos'] });
            setIsModalVisible(false);
            // Reset form
            setNewAviso({
                titulo: '',
                descripcion: '',
                TipoAviso: 'GENERAL',
                importante: false,
            });
        },
    });

    const handleCreateAviso = () => {
        if (!newAviso.titulo || !newAviso.descripcion) return;
        createAvisoMutation.mutate(newAviso);
    };

    return {
        isAdmin,
        isResident,
        isSecurity,
        avisos: filteredAvisos,
        isLoading: avisosQuery.isLoading,
        selectedTipo,
        setSelectedTipo,
        isModalVisible,
        setIsModalVisible,
        newAviso,
        setNewAviso,
        handleCreateAviso,
        isCreating: createAvisoMutation.isPending,
    };
}
