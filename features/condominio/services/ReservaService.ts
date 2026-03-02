import { apiClient } from "../../../shared/Api/Api_Client";
import { CreateReservaDTO } from "../types/condominio";

/**
 * Crea una nueva reservación para un área común
 * @param dto Datos de la reservación
 */
export const createReservaService = async (dto: CreateReservaDTO): Promise<void> => {
    await apiClient.post("/reservas", dto);
};
