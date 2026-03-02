import { apiClient } from "../../../shared/Api/Api_Client";
import { Cuota, PagarCuotaDTO } from "../types/condominio";

export const getMisCuotasService = async (personaId: number): Promise<Cuota[]> => {
    try {
        const response = await apiClient.get<Cuota[]>(`/cuotas/mis-cuotas/${personaId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las cuotas:", error);
        throw error;
    }
};

export const getAllCuotasService = async (): Promise<Cuota[]> => {
    try {
        const response = await apiClient.get<Cuota[]>("/cuotas");
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las cuotas:", error);
        throw error;
    }
};

export const pagarCuotaService = async (idCuota: number, dto: PagarCuotaDTO): Promise<void> => {
    try {
        await apiClient.patch(`/cuotas/${idCuota}/pagar`, dto);
    } catch (error) {
        console.error("Error al pagar la cuota:", error);
        throw error;
    }
};
