import { apiClient } from "../../../shared/Api/Api_Client";
import { AreaComun, CreateAreaComunDTO } from "../types/condominio";

// Listar todas las áreas comunes
export const getAreasComunesService = async (): Promise<AreaComun[]> => {
    const response = await apiClient.get<AreaComun[]>("/areas-comunes");
    return response.data;
};

// Guardar área común
export const createAreaComunService = async (condominioId: number, dto: CreateAreaComunDTO): Promise<void> => {
    await apiClient.post(`/areas-comunes/condominio/${condominioId}`, dto);
};
// Eliminar área común
export const deleteAreaComunService = async (id: number): Promise<void> => {
    await apiClient.delete(`/areas-comunes/${id}`);
};
