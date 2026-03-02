import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../../shared/Api/Api_Client";
import { AssignResidentDTO, Condominio, CondominioResponse, CreateUnidadDTO } from "../types/condominio";

const BASE_URL = "http://192.168.137.1:8083/api";


export const getCondominiosService = async (): Promise<Condominio[]> => {
    const response = await apiClient.get<CondominioResponse>("/condominios");
    return response.data.content;
};

// Obtener un condominio por id
export const getCondominioByIdService = async (id: number): Promise<Condominio> => {
    const response = await apiClient.get(`/condominios/${id}`);
    return response.data as Condominio;
};


// Registrar nuevo condominio (usa XMLHttpRequest para multipart/form-data confiable en Android)
export const createCondominioService = async (formData: FormData): Promise<void> => {
    const token = await AsyncStorage.getItem("jwt_token");

    if (!token) {
        console.error("[XHR] ERROR: No hay token JWT. Inicia sesión nuevamente.");
        throw { response: { status: 401, data: { message: "Sin token. Por favor inicia sesión." } } };
    }

    console.log("[XHR] Token encontrado (inicio):", token.substring(0, 20) + "...");
    console.log("[XHR] Enviando FormData con XMLHttpRequest...");

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${BASE_URL}/condominios`);

        // Solo Authorization — XHR establece el Content-Type multipart/form-data con boundary automáticamente
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.onload = () => {
            console.log(`[XHR] Respuesta recibida. Status: ${xhr.status}`);
            console.log("[XHR] Body:", xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("[XHR] ¡Condominio registrado con éxito!");
                resolve();
            } else {
                console.error(`[XHR] Error del servidor (${xhr.status}):`, xhr.responseText);
                reject({ response: { status: xhr.status, data: { message: xhr.responseText || `Error ${xhr.status}` } } });
            }
        };

        xhr.onerror = () => {
            console.error("[XHR] Error de red - no se pudo conectar al servidor.");
            reject({ message: "Network Error" });
        };

        xhr.ontimeout = () => {
            console.error("[XHR] Tiempo de espera agotado.");
            reject({ message: "Timeout al subir imagen" });
        };

        xhr.timeout = 30000; // 30 segundos para dar tiempo a la subida a Cloudinary

        xhr.send(formData);
    });
};






// Actualizar condominio existente
export const updateCondominioService = async (id: number, dto: Condominio): Promise<void> => {
    await apiClient.put(`/condominios/${id}`, dto);
};

// Eliminar condominio
export const deleteCondominioService = async (id: number): Promise<void> => {
    await apiClient.delete(`/condominios/${id}`);
};


// registrar una unidadcl
export const createUnidadService = async (dto: CreateUnidadDTO): Promise<void> => {
    await apiClient.post("/unidades", dto);
};


// asignar un residente a una unidad
export const assignResidentService = async (dto: AssignResidentDTO): Promise<void> => {
    await apiClient.post("/condominos", dto);
};

// obtener la residencia actual de un usuario (para residentes)
export const getMiResidenciaService = async (personaId: number): Promise<any> => {
    // Se pasa el ID de la persona, no el username
    const response = await apiClient.get(`/condominos/persona/${personaId}`);
    return response.data; // Retorna { unidad: {...}, condominio: {...}, ... }
};



