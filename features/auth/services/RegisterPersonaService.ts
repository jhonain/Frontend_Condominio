import { apiClient } from "../../../shared/Api/Api_Client";
import { PersonaUserDTO, TipoDocumento } from "../../../shared/interfaces";

// Registrar nuevo usuario
export const RegisterPersonaService = async (dto: PersonaUserDTO): Promise<void> => {
  await apiClient.post("/personas/personaUser", dto);
};

// Obtener tipos de documento para el combobox
export const getTipoDocumentosService = async (): Promise<TipoDocumento[]> => {
  console.log('URL final:', apiClient.defaults.baseURL + '/tipoDocumentos');

  const response = await apiClient.get('/tipoDocumentos');
  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  console.log('Respuesta inesperada de /tipoDocumentos:', data);
  return [];
};

export const getPersonasService = async (): Promise<any[]> => {
  const response = await apiClient.get('/personas');
  return response.data.content;
};
