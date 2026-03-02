import { apiClient } from "../../../shared/Api/Api_Client";
import { DashboardResidente } from "../types/condominio";

/**
 * Obtiene la información detallada del dashboard para un residente
 * @param personaId El ID de la persona (mismo que el ID de usuario)
 */
export const getDashboardResidenteService = async (personaId: number): Promise<DashboardResidente> => {
    const response = await apiClient.get<DashboardResidente>(`/dashboard/residente/${personaId}`);
    return response.data;
};
