
export interface TipoDocumento {
    id: number;
    nombre: string;
}

export interface Persona {
    id?: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    fechaNac: string;
    numeroDoc: string;
    tipoDocumentoId: number;
    estado?: boolean;
    fechaRegis?: string;
}
