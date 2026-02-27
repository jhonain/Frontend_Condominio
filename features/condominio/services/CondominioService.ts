import { apiClient } from "../../../shared/Api/Api_Client";
import { AssignResidentDTO, Condominio, CondominioResponse, CreateUnidadDTO } from "../types/condominio";

// Listar todos los condominios
export const getCondominiosService = async (): Promise<Condominio[]> => {
    const response = await apiClient.get<CondominioResponse>("/condominios");
    return response.data.content;
};

// Obtener un condominio por id
export const getCondominioByIdService = async (id: number): Promise<Condominio> => {
    const response = await apiClient.get(`/condominios/${id}`);
    return response.data as Condominio;
};


// Registrar nuevo condominio
export const createCondominioService = async (dto: Condominio): Promise<void> => {
    await apiClient.post("/condominios", dto);
};


// Actualizar condominio existente
export const updateCondominioService = async (id: number, dto: Condominio): Promise<void> => {
    await apiClient.put(`/condominios/${id}`, dto);
};

// Eliminar condominio
export const deleteCondominioService = async (id: number): Promise<void> => {
    await apiClient.delete(`/condominios/${id}`);
};



export const createUnidadService = async (dto: CreateUnidadDTO): Promise<void> => {
    await apiClient.post("/unidades", dto);
};



export const assignResidentService = async (dto: AssignResidentDTO): Promise<void> => {
    await apiClient.post("/condominos", dto);
};
