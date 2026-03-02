import { apiClient } from "../../../shared/Api/Api_Client";
import { CreateVehiculoDTO, Vehiculo } from "../types/condominio";

export const getVehiculosByPersonaService = async (personaId: number): Promise<Vehiculo[]> => {
    try {
        const response = await apiClient.get<Vehiculo[]>(`/vehiculos/persona/${personaId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los vehículos:", error);
        throw error;
    }
};

export const createVehiculoService = async (dto: CreateVehiculoDTO): Promise<void> => {
    try {
        await apiClient.post("/vehiculos", dto);
    } catch (error) {
        console.error("Error al registrar el vehículo:", error);
        throw error;
    }
};

export const deleteVehiculoService = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/vehiculos/${id}`);
    } catch (error) {
        console.error("Error al eliminar el vehículo:", error);
        throw error;
    }
};
export const updateVehiculoService = async (idVehiculo: number, dto: Partial<CreateVehiculoDTO>): Promise<void> => {
    try {
        await apiClient.put(`/vehiculos/${idVehiculo}`, dto);
    } catch (error) {
        console.error("Error al actualizar el vehículo:", error);
        throw error;
    }
};

export const getAllVehiculosService = async (): Promise<Vehiculo[]> => {
    try {
        const response = await apiClient.get<Vehiculo[]>("/vehiculos");
        return response.data;
    } catch (error) {
        console.error("Error al obtener todos los vehículos:", error);
        throw error;
    }
};
