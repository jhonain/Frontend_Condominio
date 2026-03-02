import { apiClient } from "../../../shared/Api/Api_Client";
import { Aviso, CreateAvisoDTO } from "../types/condominio";

// Listar todos los avisos
export const getAvisosService = async (): Promise<Aviso[]> => {
    try {
        const response = await apiClient.get<Aviso[]>("/avisos");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los avisos:", error);
        throw error;
    }
};

// Registrar un nuevo aviso
export const createAvisoService = async (dto: CreateAvisoDTO): Promise<void> => {
    try {
        await apiClient.post("/avisos", dto);
    } catch (error) {
        console.error("Error al crear el aviso:", error);
        throw error;
    }
};
