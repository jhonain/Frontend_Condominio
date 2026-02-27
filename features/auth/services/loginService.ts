import { apiClient } from "../../../shared/Api/Api_Client";
import { LoginResponse } from "../../../shared/interfaces/auth_interfaces";

export const loginService = async (username: string, password: string): Promise<string> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", { username, password });
    return response.data.token;
};