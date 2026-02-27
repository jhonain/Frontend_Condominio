import { LinearGradient } from 'expo-linear-gradient';
import {
    Building2,
    LayoutDashboard,
    LogOut,
    Shield
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { RolType } from '@/shared/interfaces';
import { useHomeViewModel } from '../viewmodels/UseHomeViewModel';

const roleLabels: Record<RolType, string> = {
    ADMIN: 'Administrador',
    RESIDENTE: 'Residente',
    SEGURIDAD: 'Seguridad',
};

const roleBadgeColors: Record<RolType, string> = {
    ADMIN: '#E11D48', // Rojo para Admin
    RESIDENTE: Colors.primary, // Azul/Verde para Residente
    SEGURIDAD: '#D97706', // Ámbar para Seguridad
};

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { rol, logout } = useAuth();
    const vm = useHomeViewModel();

    if (vm.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Simplificado */}
            <LinearGradient
                colors={
                    rol === 'ADMIN'
                        ? ['#1E293B', '#334155']
                        : rol === 'SEGURIDAD'
                            ? ['#92400E', '#B45309']
                            : [Colors.primary, Colors.primaryDark]
                }
                style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.greetingContainer}>
                            {rol === 'ADMIN' ? (
                                <LayoutDashboard size={20} color="rgba(255,255,255,0.8)" />
                            ) : rol === 'SEGURIDAD' ? (
                                <Shield size={20} color="rgba(255,255,255,0.8)" />
                            ) : (
                                <Building2 size={20} color="rgba(255,255,255,0.8)" />
                            )}

                            {rol && (
                                <View style={[styles.roleBadge, { backgroundColor: roleBadgeColors[rol] }]}>
                                    <Text style={styles.roleBadgeText}>{roleLabels[rol]}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.greeting}>
                            Hola, {vm.firstName}
                        </Text>

                        <Text style={styles.roleDetail}>
                            Sesión iniciada como {rol ? roleLabels[rol] : 'Usuario'}
                        </Text>
                    </View>

                    {/* Botón de Logout para que puedas probar otros usuarios fácilmente */}
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <LogOut size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Cuerpo del Screen - Placeholder mientras conectas APIs */}
            <View style={styles.content}>
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>¡Bienvenido al Sistema!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Actualmente estás visualizando el panel de {rol ? roleLabels[rol] : 'Usuario'}.
                        Pronto aparecerán aquí tus herramientas y estadísticas.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    roleBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    greeting: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    roleDetail: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    logoutButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 15,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    welcomeCard: {
        backgroundColor: '#FFF',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});