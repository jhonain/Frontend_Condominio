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

export const goToAvisos = () => {
  router.push('/(tabs)/announcements');
};

export const goToVehiculo = () => {
  router.push('/(tabs)/vehicles');
};

export const goToProfile = () => {
  router.push('/(tabs)/profile');
};