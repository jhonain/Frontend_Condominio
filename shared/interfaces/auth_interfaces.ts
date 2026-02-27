import { RolType } from "./usuario_interfaces";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtPayload {
    rol: RolType;
    sub: string;
    iat: number;
    exp: number;
}

