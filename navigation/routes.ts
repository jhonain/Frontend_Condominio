// app/navigation/navigationHelpers.ts
import { router } from 'expo-router';

export const goToLogin = () => {
  router.replace('/(auth)/login');
};

export const goToRegisterPersonaUser = () => {
  router.push('/(auth)/registerPersonaUser');
};

//export const goToTabs = () => {
//  router.replace('/(tabs)');
//};

export const goToHome = () => {
  router.replace('/(tabs)/(home)');
};