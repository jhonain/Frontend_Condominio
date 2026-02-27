import { useRouter } from 'expo-router';
import {
    Bell,
    Car,
    ChevronRight,
    FileText,
    HelpCircle,
    Lock,
    LogOut,
    Mail,
    Settings,
    Shield,
    User
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useProfileViewModel } from '@/features/condominio/viewmodels/UseProfileViewModel';

const roleLabels = {
    ADMIN: 'Administrador',
    RESIDENTE: 'Residente',
    SEGURIDAD: 'Seguridad',
};

const roleBadgeColors = {
    ADMIN: '#E11D48',
    RESIDENTE: Colors.primary,
    SEGURIDAD: '#D97706',
};

interface MenuItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    subtitle?: string;
    onPress?: () => void;
    danger?: boolean;
}

export default function ProfileScreen() {
    const vm = useProfileViewModel();
    const { rol, isResident } = useAuth();
    const router = useRouter();

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Cuenta',
            items: [
                {
                    id: '1',
                    title: 'Notificaciones',
                    subtitle: 'Configurar alertas y avisos',
                    icon: <Bell size={20} color={Colors.textSecondary} />,
                },
                {
                    id: '2',
                    title: 'Privacidad y Seguridad',
                    subtitle: 'Contraseña y autenticación',
                    icon: <Lock size={20} color={Colors.textSecondary} />,
                },
                {
                    id: '3',
                    title: 'Preferencias',
                    subtitle: 'Idioma y personalización',
                    icon: <Settings size={20} color={Colors.textSecondary} />,
                },
            ],
        },
        ...(isResident
            ? [
                {
                    title: 'Mis Vehículos',
                    items: [
                        {
                            id: 'vehicles',
                            title: 'Gestionar Vehículos',
                            subtitle: 'Registrar y administrar tus vehículos',
                            icon: <Car size={20} color={Colors.primary} />,
                            onPress: () => router.push('/vehicles' as never),
                        },
                    ],
                },
            ]
            : []),
        {
            title: 'Soporte',
            items: [
                {
                    id: '4',
                    title: 'Centro de Ayuda',
                    subtitle: 'Preguntas frecuentes',
                    icon: <HelpCircle size={20} color={Colors.textSecondary} />,
                },
                {
                    id: '5',
                    title: 'Términos y Condiciones',
                    icon: <FileText size={20} color={Colors.textSecondary} />,
                },
            ],
        },
        {
            title: '',
            items: [
                {
                    id: '6',
                    title: 'Cerrar Sesión',
                    icon: <LogOut size={20} color={Colors.error} />,
                    danger: true,
                    onPress: vm.handleLogout,
                },
            ],
        },
    ];

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={item.onPress}
        >
            <View style={styles.menuItemLeft}>
                {item.icon}
                <View style={styles.menuItemInfo}>
                    <Text style={[styles.menuItemTitle, item.danger && styles.dangerText]}>
                        {item.title}
                    </Text>
                    {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
            {!item.danger && <ChevronRight size={20} color={Colors.textLight} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <User size={48} color={Colors.textLight} />
                    </View>
                </View>
                <Text style={styles.userName}>{vm.user?.username.split('@')[0] ?? 'Usuario'}</Text>
                <Text style={styles.userEmail}>{vm.user?.username ?? ''}</Text>
                <View style={[styles.roleChip, { backgroundColor: rol ? roleBadgeColors[rol] : Colors.textLight }]}>
                    {rol === 'ADMIN' ? (
                        <Shield size={14} color="#FFFFFF" />
                    ) : rol === 'SEGURIDAD' ? (
                        <Shield size={14} color="#FFFFFF" />
                    ) : (
                        <User size={14} color="#FFFFFF" />
                    )}
                    <Text style={styles.roleChipText}>{rol ? roleLabels[rol] : 'Usuario'}</Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Mail size={18} color={Colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Correo Electrónico</Text>
                        <Text style={styles.infoValue}>{vm.user?.username ?? '-'}</Text>
                    </View>
                </View>
            </View>

            {menuSections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.menuSection}>
                    {section.title !== '' && (
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    )}
                    <View style={styles.menuCard}>
                        {section.items.map((item, index) => (
                            <View key={item.id}>
                                {renderMenuItem(item)}
                                {index < section.items.length - 1 && (
                                    <View style={styles.menuSeparator} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            ))}

            <Text style={styles.versionText}>Versión 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative' as const,
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Colors.surface,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatarButton: {
        position: 'absolute' as const,
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.background,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    roleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    roleChipText: {
        fontSize: 13,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
    infoCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 4,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 14,
    },
    menuSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
        marginBottom: 12,
        marginLeft: 20,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
    },
    menuCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        borderRadius: 16,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuItemInfo: {
        marginLeft: 14,
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '500' as const,
        color: Colors.text,
    },
    menuItemSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    dangerText: {
        color: Colors.error,
    },
    menuSeparator: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: 50,
    },
    versionText: {
        fontSize: 13,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: 32,
    },
});