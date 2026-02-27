// features/auth/services/googleAuthService.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { apiClient } from '../../../shared/Api/Api_Client'; // tu instancia con baseURL

export const configureGoogleSignin = () => {
    GoogleSignin.configure({
        webClientId: '930798896957-i2v3i81bhm5trmc9h32jh6oo1qd5nt1t.apps.googleusercontent.com',
    });
};

export const googleSignIn = async () => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();

    const response = await apiClient.post('/auth/google', {
        token: idToken, // clave igual que en tu LoginController
    });

    console.log("response.data", response.data);
    return response.data; // { token: 'jwt...' }
};
