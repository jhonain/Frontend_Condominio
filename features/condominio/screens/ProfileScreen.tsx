import { useRouter } from 'expo-router';
import {
    Bell,
    Building2,
    Car,
    ChevronRight,
    DoorOpen,
    FileText,
    HelpCircle,
    Lock,
    LogOut,
    Mail,
    Phone,
    Settings,
    User
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
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
    const { rol } = useAuth();
    const router = useRouter();

    if (vm.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'CUENTA',
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
        ...((vm.isResident || rol === 'ADMIN' || rol === 'SEGURIDAD')
            ? [
                {
                    title: (rol === 'ADMIN' || rol === 'SEGURIDAD') ? 'GESTIÓN DE VEHÍCULOS' : 'MIS VEHÍCULOS',
                    items: [
                        {
                            id: 'vehicles',
                            title: 'Gestionar Vehículos',
                            subtitle: (rol === 'ADMIN' || rol === 'SEGURIDAD')
                                ? 'Ver y administrar vehículos del condominio'
                                : 'Registrar y administrar tus vehículos',
                            icon: <Car size={20} color={Colors.primary} />,
                            onPress: () => router.push('/vehicles' as never),
                        },
                    ],
                },
            ]
            : []),
        {
            title: 'SOPORTE',
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
    ];

    const renderMenuItem = (item: MenuItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={item.onPress}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                    {item.icon}
                </View>
                <View style={styles.menuItemInfo}>
                    <Text style={[styles.menuItemTitle, item.danger && styles.dangerText]}>
                        {item.title}
                    </Text>
                    {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
            {!item.danger && <ChevronRight size={18} color={Colors.textLight} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={vm.isRefreshing}
                    onRefresh={vm.refresh}
                    colors={[Colors.primary]}
                    tintColor={Colors.primary}
                />
            }
        >
            <View style={styles.profileHeader}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            {vm.residentData?.nombreCompleto ? (
                                <Text style={styles.avatarText}>{vm.residentData.nombreCompleto.charAt(0)}</Text>
                            ) : (
                                <User size={48} color={Colors.textLight} />
                            )}
                        </View>
                        <View style={styles.editAvatarBadge}>
                            <User size={14} color="#FFFFFF" />
                        </View>
                    </View>
                </View>

                <Text style={styles.userName}>
                    {vm.isResident
                        ? (vm.residentData?.nombreCompleto || vm.user?.username.split('@')[0])
                        : (vm.personaData ? `${vm.personaData.nombre} ${vm.personaData.apellidos}` : vm.user?.username.split('@')[0])
                    }
                </Text>
                <Text style={styles.userEmail}>
                    {vm.isResident
                        ? (vm.residentData?.email || vm.user?.username || '')
                        : (vm.personaData?.email || vm.user?.username || '')
                    }
                </Text>

                {rol && (
                    <View style={[styles.roleChip, { backgroundColor: roleBadgeColors[rol] }]}>
                        <User size={14} color="#FFFFFF" strokeWidth={3} />
                        <Text style={styles.roleChipText}>{roleLabels[rol]}</Text>
                    </View>
                )}
            </View>

            {vm.isResident && vm.residentData && (
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <Building2 size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Condominio</Text>
                            <Text style={styles.infoValue}>{vm.residentData.condominio?.nombre || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSeparator} />

                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <DoorOpen size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Unidad</Text>
                            <Text style={styles.infoValue}>{vm.residentData.unidad?.codigo || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSeparator} />

                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <Phone size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoValue}>{vm.residentData.telefono || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSeparator} />

                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <Mail size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Correo</Text>
                            <Text style={styles.infoValue}>{vm.residentData?.email || vm.user?.username || '-'}</Text>
                        </View>
                    </View>
                </View>
            )}

            {!vm.isResident && vm.personaData && (
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <Phone size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoValue}>{vm.personaData.telefono || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSeparator} />

                    <View style={styles.infoItem}>
                        <View style={[styles.infoIconBox, { backgroundColor: 'rgba(13, 148, 136, 0.1)' }]}>
                            <Mail size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>Correo Electrónico</Text>
                            <Text style={styles.infoValue}>{vm.personaData?.email || vm.user?.username || '-'}</Text>
                        </View>
                    </View>
                </View>
            )}

            {menuSections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
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

            <TouchableOpacity style={styles.logoutCard} onPress={vm.handleLogout}>
                <LogOut size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Versión 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarPlaceholder: {
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: Colors.primary,
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 14,
    },
    roleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    roleChipText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoRight: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        textTransform: 'none',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
    },
    infoSeparator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    menuSection: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
        marginBottom: 12,
        marginLeft: 24,
        letterSpacing: 1,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemInfo: {
        marginLeft: 12,
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    menuItemSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    menuSeparator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 60,
    },
    logoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 32,
        padding: 18,
        borderRadius: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.error,
    },
    dangerText: {
        color: Colors.error,
    },
    versionText: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 32,
    },
});