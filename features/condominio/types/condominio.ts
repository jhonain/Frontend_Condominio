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

export interface Horario {
    id?: number;
    horaInicio: string;
    horaFin: string;
}

export interface AreaComun {
    id: number;
    nombre: string;
    descripcion: string;
    capacidad: number;
    imagenUrl: string | null;
    estado: string;
    condominioId: number;
    condominioNombre: string;
    fechaRegistro: string;
    horarios: Horario[];
}

export interface CreateAreaComunDTO {
    nombre: string;
    descripcion: string;
    capacidad: number;
    horarios: Horario[];
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

export type TipoAviso = "GENERAL" | "MANTENIMIENTO" | "SEGURIDAD" | "EVENTO";

export interface Aviso {
    id: number;
    titulo: string;
    descripcion: string;
    TipoAviso: TipoAviso;
    importante: boolean;
    fechaAviso?: string; // e.g., "2024-02-28"
}

export interface CreateAvisoDTO {
    titulo: string;
    descripcion: string;
    TipoAviso: TipoAviso;
    importante: boolean;
}

export interface ReservaResponse {
    id: number;
    areaComunId: number;
    areaComunNombre: string;
    personaId: number;
    personaNombre: string;
    fecha: string;
    horarioInicio: string;
    horarioFin: string;
    horarioId: number;
    estado: string;
    fechaRegistro: string;
}

export interface DashboardResidente {
    personaId: number;
    nombreCompleto: string;
    email: string;
    telefono: string;
    nombre: string;
    condominio: {
        id: number;
        nombre: string;
        direccion: string;
        totalUnidades: number;
        imagenUrl: string | null;
    };
    unidad: Unidad;
    areasComunes: AreaComun[];
    misReservas: ReservaResponse[];
}
export interface CreateReservaDTO {
    fecha: string;
    personaId: number;
    areaComunId: number;
    horarioId: number;
}
export interface Cuota {
    id: number;
    numeroCuota: number;
    monto: number;
    estado: "PENDIENTE" | "PAGADO" | "VENCIDO";
    fechaVencimiento: string;
    fechaPago: string | null;
    fechaRegistro: string;
    metodoPago: string | null;
    observacion: string | null;
    nombreResidente?: string;
    apellidosResidente?: string;
    unidadCodigo?: string;
}

export type MetodoPago = "EFECTIVO" | "TRANSFERENCIA" | "DEPOSITO" | "YAPE" | "PLIN";

export interface PagarCuotaDTO {
    metodoPago: MetodoPago;
    observacion: string;
}

export interface Vehiculo {
    id: number;
    personaId: number;
    nombre: string;
    apellidos: string;
    tipo: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    placa: string;
    estado: boolean;
}

export interface CreateVehiculoDTO {
    personaId: number;
    tipo: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    placa: string;
}
