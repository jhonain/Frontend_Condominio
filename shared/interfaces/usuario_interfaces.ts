import { Persona } from "./persona_interfaces";

export type RolType = "ADMIN" | "RESIDENTE" | "SEGURIDAD";

export interface Usuario {
    id?: number;
    username: string;
    password?: string;
    activo?: boolean;
    roles: RolType[];
}

export interface UsuarioSession {
    username: string;
    roles: RolType[]; // lo hacemos array para reutilizar tu modelo
}   

export interface PersonaUserDTO extends Persona, Usuario {}
