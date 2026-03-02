import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    Bell,
    User,
    CreditCard,
    FileText,
    Users,
    UserPlus,
    Calendar,
    CheckCircle,
    TrendingUp,
    Building,
    Megaphone,
    ChevronRight,
    LayoutGrid,
    Car,
    Shield
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { goToAvisos } from '@/navigation/routes';
import { RolType } from '@/shared/interfaces';
import { useHomeViewModel } from '../viewmodels/UseHomeViewModel';

const roleLabels: Record<RolType, string> = {
    ADMIN: 'Administrador',
    RESIDENTE: 'Residente',
    SEGURIDAD: 'Seguridad',
};

const roleBadgeColors: Record<RolType, string> = {
    ADMIN: '#E11D48',
    RESIDENTE: '#0D9488',
    SEGURIDAD: '#D97706',
};

const headerGradientColors: Record<RolType, [string, string]> = {
    ADMIN: ['#2C3E50', '#1A252F'], // Color oscuro del prototipo
    SEGURIDAD: ['#92400E', '#B45309'],
    RESIDENTE: ['#0D9488', '#0F766E'],
};

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { rol, logout, isResident, isSecurity, isAdmin } = useAuth();
    const vm = useHomeViewModel();

    if (vm.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const renderHeader = () => (
        <LinearGradient
            colors={rol ? headerGradientColors[rol] : [Colors.primary, Colors.primaryDark]}
            style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.headerTop}>
                <View style={styles.roleBadgeContainer}>
                    <Shield size={14} color="#FFF" />
                    <View style={[styles.roleBadge, { backgroundColor: rol ? roleBadgeColors[rol] : 'rgba(255,255,255,0.2)' }]}>
                        <Text style={styles.roleBadgeText}>{rol ? roleLabels[rol] : 'Usuario'}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarButton}>
                    <View style={styles.avatarPlaceholder}>
                        <User size={24} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.headerInfo}>
                <Text style={styles.greeting}>Hola, {vm.firstName}</Text>
                <Text style={styles.headerSubtitle}>
                    {isSecurity ? 'Caseta de Seguridad' : isAdmin ? 'Panel de Administración' :
                        `${ vm.myResidency?.condominio?.nombre || 'Condominio' } • Unidad ${ vm.myResidency?.unidad?.codigo || '---' } `}
                </Text>
            </View>
        </LinearGradient>
    );

    const renderSecurityStats = () => (
        <View style={styles.statsGrid}>
            <TouchableOpacity
                style={[styles.statCard, { backgroundColor: '#FFFBF5' }]}
                activeOpacity={0.7}
                onPress={() => router.push('/vehicles' as any)}
            >
                <View style={[styles.statIconContainer, { backgroundColor: '#FFF0D9' }]}>
                    <Car size={26} color="#D97706" />
                </View>
                <Text style={[styles.statNumber, { color: '#D97706' }]}>{vm.totalVehiculos}</Text>
                <Text style={[styles.statLabel, { color: '#D97706' }]}>Vehículos</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.statCard, { backgroundColor: '#F5FBFF' }]}
                activeOpacity={0.7}
                onPress={() => goToAvisos()}
            >
                <View style={[styles.statIconContainer, { backgroundColor: '#D9F2FF' }]}>
                    <Bell size={26} color={Colors.secondary} />
                </View>
                <Text style={[styles.statNumber, { color: Colors.secondary }]}>{vm.avisos.length}</Text>
                <Text style={[styles.statLabel, { color: Colors.secondary }]}>Avisos</Text>
            </TouchableOpacity>
        </View>
    );

    const renderResidentContent = () => (
        <>
            {/* Tarjeta de Pago Pendiente */}
            <View style={styles.paymentCard}>
                <View style={[styles.paymentIconContainer, { backgroundColor: '#F59E0B' }]}>
                    <CreditCard size={24} color="#FFF" />
                </View>
                <View style={styles.paymentInfo}>
                    <Text style={styles.paymentLabel}>
                        {vm.pendingCuota ? 'Pago pendiente' : 'Sin pagos pendientes'}
                    </Text>
                    <Text style={styles.paymentAmount}>
                        {vm.pendingCuota ? `S / ${ vm.pendingCuota.monto.toLocaleString() } ` : 'Al día'}
                    </Text>
                    {vm.pendingCuota && (
                        <Text style={styles.paymentDue}>
                            Vence: {vm.pendingCuota.fechaVencimiento}
                        </Text>
                    )}
                </View>
                {vm.pendingCuota && (
                    <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
                        <Text style={styles.payButtonText}>Pagar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Acciones Rápidas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones rápidas</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity style={styles.quickActionItem}>
                        <View style={styles.quickActionIcon}>
                            <AlertTriangle size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickActionLabel}>Reportar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionItem}>
                        <View style={styles.quickActionIcon}>
                            <Users size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickActionLabel}>Directorio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionItem}>
                        <View style={styles.quickActionIcon}>
                            <FileText size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickActionLabel}>Documentos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionItem}>
                        <View style={styles.quickActionIcon}>
                            <UserPlus size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickActionLabel}>Visitantes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );

    const renderResidentSummary = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
                    <Text style={[styles.statNumber, { color: '#065F46' }]}>{vm.paidCuotasCount}</Text>
                    <Text style={[styles.statLabel, { color: '#065F46' }]}>Pagos realizados</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#F0F9FF' }]}>
                    <Text style={[styles.statNumber, { color: '#0369A1' }]}>{vm.reservationsCount}</Text>
                    <Text style={[styles.statLabel, { color: '#0369A1' }]}>Reservaciones</Text>
                </View>
            </View>
        </View>
    );


    const renderAdminContent = () => (
        <>
            {/* Grid de Estadísticas 2x2 para Admin */}
            <View style={styles.adminGrid}>
                <View style={styles.adminGridRow}>
                    <TouchableOpacity style={[styles.adminStatCard, { backgroundColor: '#F0F7FF' }]} activeOpacity={0.7} onPress={() => router.push('/(tabs)/condominios' as any)}>
                        <View style={[styles.adminStatIcon, { backgroundColor: '#3B82F6' }]}>
                            <Building size={20} color="#FFF" />
                        </View>
                        <Text style={styles.adminStatNumber}>{vm.totalCondos}</Text>
                        <Text style={styles.adminStatLabel}>Condominios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.adminStatCard, { backgroundColor: '#F2FFF2' }]} activeOpacity={0.7} >
                        <View style={[styles.adminStatIcon, { backgroundColor: '#10B981' }]}>
                            <TrendingUp size={20} color="#FFF" />
                        </View>
                        <Text style={styles.adminStatNumber}>S/ {vm.totalRecaudado.toLocaleString()}</Text>
                        <Text style={styles.adminStatLabel}>Recaudado</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.adminGridRow}>
                    <TouchableOpacity style={[styles.adminStatCard, { backgroundColor: '#FFF9F0' }]} activeOpacity={0.7} >
                        <View style={[styles.adminStatIcon, { backgroundColor: '#F59E0B' }]}>
                            <CreditCard size={20} color="#FFF" />
                        </View>
                        <Text style={styles.adminStatNumber}>{vm.totalPendingPayments}</Text>
                        <Text style={styles.adminStatLabel}>Pag. Pendientes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.adminStatCard, { backgroundColor: '#FFF5F8' }]} activeOpacity={0.7} onPress={() => goToAvisos()}>
                        <View style={[styles.adminStatIcon, { backgroundColor: '#EC4899' }]}>
                            <Megaphone size={20} color="#FFF" />
                        </View>
                        <Text style={styles.adminStatNumber}>{vm.avisos.length}</Text>
                        <Text style={styles.adminStatLabel}>Avisos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Acciones Rápidas Admin */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones rápidas</Text>
                <TouchableOpacity style={styles.adminActionCard} activeOpacity={0.7} onPress={() => router.push('/(tabs)/condominios' as any)}>
                    <View style={[styles.adminActionIcon, { backgroundColor: '#EFF6FF' }]}>
                        <Building size={22} color="#3B82F6" />
                    </View>
                    <View style={styles.adminActionInfo}>
                        <Text style={styles.adminActionTitle}>Registrar Condominio</Text>
                        <Text style={styles.adminActionDesc}>Agregar nuevo condominio o área común</Text>
                    </View>
                    <ChevronRight size={20} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.adminActionCard} activeOpacity={0.7} onPress={() => goToAvisos()}>
                    <View style={[styles.adminActionIcon, { backgroundColor: '#FFF5F8' }]}>
                        <Megaphone size={22} color="#EC4899" />
                    </View>
                    <View style={styles.adminActionInfo}>
                        <Text style={styles.adminActionTitle}>Publicar Aviso</Text>
                        <Text style={styles.adminActionDesc}>Crear nuevo aviso para residentes</Text>
                    </View>
                    <ChevronRight size={20} color="#94A3B8" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.adminActionCard} activeOpacity={0.7}>
                    <View style={[styles.adminActionIcon, { backgroundColor: '#F0FDF4' }]}>
                        <CheckCircle size={22} color="#10B981" />
                    </View>
                    <View style={styles.adminActionInfo}>
                        <Text style={styles.adminActionTitle}>Gestionar Pagos</Text>
                        <Text style={styles.adminActionDesc}>Administrar cuotas y verificaciones</Text>
                    </View>
                    <ChevronRight size={20} color="#94A3B8" />
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderHeader()}

            <View style={styles.content}>
                {isSecurity && renderSecurityStats()}
                {isAdmin && renderAdminContent()}
                {isResident && renderResidentContent()}

                {(isSecurity || isAdmin || isResident) && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Últimos avisos</Text>
                            <TouchableOpacity onPress={() => goToAvisos()}>
                                <Text style={styles.seeAllText}>Ver todos {'>'}</Text>
                            </TouchableOpacity>
                        </View>

                        {vm.avisos.slice(0, 3).map((aviso) => (
                            <TouchableOpacity key={aviso.id} style={styles.avisoCard} activeOpacity={0.7}>
                                <View style={styles.avisoHeader}>
                                    <View style={[styles.avisoIconBackground, { backgroundColor: aviso.importante ? '#FEE2E2' : '#E0F2FE' }]}>
                                        <Bell size={14} color={aviso.importante ? '#EF4444' : Colors.secondary} />
                                    </View>
                                    <Text style={styles.avisoDate}>{aviso.fechaAviso || 'Reciente'}</Text>
                                </View>
                                <Text style={styles.avisoTitle} numberOfLines={1}>{aviso.titulo}</Text>
                                <Text style={styles.avisoDesc} numberOfLines={2}>{aviso.descripcion}</Text>
                            </TouchableOpacity>
                        ))}

                        {vm.avisos.length === 0 && (
                            <View style={styles.emptyAvisos}>
                                <Bell size={32} color={Colors.textLight} />
                                <Text style={styles.emptyAvisosText}>No hay avisos recientes</Text>
                            </View>
                        )}
                    </View>
                )}

                {isResident && renderResidentSummary()}
            </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    roleBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    roleBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    avatarButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
        padding: 2,
    },
    avatarPlaceholder: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        marginTop: 5,
    },
    greeting: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: -25,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
    residencyCard: {
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    residencyInfo: {
        marginTop: 15,
        gap: 20,
    },
    residencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    residencyLabel: {
        fontSize: 12,
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    residencyValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    residencySubValue: {
        fontSize: 14,
        color: '#64748B',
    },
    avisoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    avisoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    avisoIconBackground: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avisoDate: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
    },
    avisoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    avisoDesc: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    emptyAvisos: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    emptyAvisosText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    logoutButton: {
        display: 'none',
    },
    // Nuevos estilos Residente
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderLeftWidth: 6,
        borderLeftColor: '#F59E0B',
    },
    paymentIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    paymentAmount: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
    },
    paymentDue: {
        fontSize: 12,
        color: '#F59E0B',
        fontWeight: '700',
        marginTop: 2,
    },
    payButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    payButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 14,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    quickActionItem: {
        alignItems: 'center',
        width: '22%',
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    quickActionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },
    // Estilos Admin
    adminGrid: {
        gap: 12,
        marginBottom: 25,
    },
    adminGridRow: {
        flexDirection: 'row',
        gap: 12,
    },
    adminStatCard: {
        flex: 1,
        padding: 16,
        borderRadius: 24,
        alignItems: 'flex-start',
    },
    adminStatIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    adminStatNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
    },
    adminStatLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    adminActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    adminActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    adminActionInfo: {
        flex: 1,
    },
    adminActionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    adminActionDesc: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
});
