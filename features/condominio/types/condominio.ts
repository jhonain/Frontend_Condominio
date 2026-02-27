export interface Unidad {
    id: number;
    codigo: string;
    piso: number;
    areaM2: number;
    precioMensual: number;
    estado: string;
    imagenUrl: string | null;
}

export interface Condominio {
    id: number;
    nombre: string;
    direccion: string;
    totalUnidades: number;
    fechaRegis: string;
    estado: boolean;
    imagenUrl: string | null;
    unidades: Unidad[];
}

export interface CondominioResponse {
    content: Condominio[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface AreaComun {
    id: number;
    name: string;
    description: string;
    image: string;
    capacity: number;
    availableSlots: string[];
}

// Asignar residente a unidad
export interface AssignResidentDTO {
    personaId: number;
    unidadId: number;
    rol: string;
    fechaInicio: string;
    fechaFin: string | null;
    estado: boolean;
}


export interface CreateUnidadDTO {
    condominioId: number;
    codigo: string;
    piso: number;
    areaM2: number;
    precioMensual: number;
    imagenUrl: string | null;
}