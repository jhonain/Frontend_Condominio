import { RolType } from "./usuario_interfaces";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtPayload {
    userId: number; // Suponiendo que el ID viene aquí
    rol: RolType;
    sub: string;
    iat: number;
    exp: number;
}

