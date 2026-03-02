import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ChevronRight, Clock, Home, MapPin, Users } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useReservasViewModel } from '@/features/condominio/viewmodels/UseReservasViewModel';

export default function ReservacionesScreen() {
    const vm = useReservasViewModel();

    if (vm.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, vm.activeTab === 'areas' && styles.tabActive]}
                    onPress={() => vm.setActiveTab('areas')}
                >
                    <MapPin size={20} color={vm.activeTab === 'areas' ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.tabText, vm.activeTab === 'areas' && styles.tabTextActive]}>Áreas Comunes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, vm.activeTab === 'my-reservations' && styles.tabActive]}
                    onPress={() => vm.setActiveTab('my-reservations')}
                >
                    <Calendar size={20} color={vm.activeTab === 'my-reservations' ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.tabText, vm.activeTab === 'my-reservations' && styles.tabTextActive]}>Mis Reservas</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.isRefreshing}
                        onRefresh={vm.refreshAreas}
                        colors={[Colors.primary]}
                    />
                }
            >
                {vm.activeTab === 'areas' ? (
                    <>
                        {vm.commonAreas.length > 0 ? (
                            vm.commonAreas.map((area) => (
                                <View key={area.id} style={styles.areaCard}>
                                    {area.imagenUrl ? (
                                        <Image source={{ uri: area.imagenUrl }} style={styles.areaImage} />
                                    ) : (
                                        <View style={[styles.areaImage, styles.placeholderImage]}>
                                            <Home size={48} color={Colors.textLight} />
                                        </View>
                                    )}
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.imageGradient}
                                    />
                                    <View style={styles.areaInfo}>
                                        <Text style={styles.areaName}>{area.nombre}</Text>
                                        <Text style={styles.areaDescription} numberOfLines={2}>
                                            {area.descripcion}
                                        </Text>
                                        <View style={styles.areaFooter}>
                                            <View style={styles.capacityContainer}>
                                                <Users size={16} color="#FFFFFF" />
                                                <Text style={styles.capacityText}>Hasta {area.capacidad} personas</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.reserveButton}
                                                onPress={() => vm.handleSelectArea(area)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.reserveButtonText}>Reservar</Text>
                                                <ChevronRight size={16} color={Colors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <MapPin size={48} color={Colors.textLight} />
                                <Text style={styles.emptyText}>No hay áreas comunes disponibles</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {vm.myReservations.length > 0 ? (
                            vm.myReservations.map((reserva) => (
                                <View key={reserva.id} style={styles.reservationCard}>
                                    <View style={styles.reservationHeader}>
                                        <View style={styles.areaBadge}>
                                            <Text style={styles.areaBadgeText}>{reserva.areaComunNombre}</Text>
                                        </View>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: reserva.estado === 'CONFIRMADA' ? '#D1FAE5' : '#FEF3C7' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: reserva.estado === 'CONFIRMADA' ? '#065F46' : '#92400E' }
                                            ]}>
                                                {reserva.estado}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.reservationDetails}>
                                        <View style={styles.reservationInfoRow}>
                                            <Calendar size={16} color={Colors.textSecondary} />
                                            <Text style={styles.reservationInfoText}>{reserva.fecha}</Text>
                                        </View>
                                        <View style={styles.reservationInfoRow}>
                                            <Clock size={16} color={Colors.textSecondary} />
                                            <Text style={styles.reservationInfoText}>
                                                {reserva.horarioInicio?.slice(0, 5)} - {reserva.horarioFin?.slice(0, 5)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Calendar size={48} color={Colors.textLight} />
                                <Text style={styles.emptyText}>Aún no tienes reservaciones registradas</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <Modal
                visible={vm.showReservaModal}
                animationType="slide"
                transparent
                onRequestClose={vm.handleCloseReservaModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.sheetIndicator} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {vm.selectedArea && (
                                <>
                                    <View style={styles.heroSection}>
                                        {vm.selectedArea.imagenUrl ? (
                                            <Image source={{ uri: vm.selectedArea.imagenUrl }} style={styles.heroImage} />
                                        ) : (
                                            <View style={[styles.heroImage, styles.placeholderImage]}>
                                                <Home size={64} color={Colors.textLight} />
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.detailBody}>
                                        <Text style={styles.detailName}>{vm.selectedArea.nombre}</Text>
                                        <Text style={styles.detailDesc}>{vm.selectedArea.descripcion}</Text>

                                        <View style={styles.metaRow}>
                                            <Users size={18} color={Colors.textSecondary} />
                                            <Text style={styles.metaRowText}>
                                                Capacidad máxima: {vm.selectedArea.capacidad} personas
                                            </Text>
                                        </View>

                                        <View style={styles.schedulesSection}>
                                            <Text style={styles.sectionLabel}>Horarios disponibles</Text>
                                            <View style={styles.schedulesGrid}>
                                                {vm.selectedArea.horarios.map((h, idx) => (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={styles.scheduleChip}
                                                        onPress={() => vm.handleReservar(h.id || idx, `${h.horaInicio.slice(0, 5)} - ${h.horaFin.slice(0, 5)}`)}
                                                    >
                                                        <Clock size={16} color={Colors.primary} />
                                                        <Text style={styles.scheduleText}>{h.horaInicio.slice(0, 5)} - {h.horaFin.slice(0, 5)}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={vm.handleCloseReservaModal}
                                        >
                                            <Text style={styles.closeButtonText}>Cerrar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 64,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tabActive: {
        backgroundColor: 'rgba(13, 148, 136, 0.08)',
        borderColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
    },
    tabTextActive: {
        color: Colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    areaCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        height: 200,
        backgroundColor: Colors.surface,
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    areaImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    placeholderImage: {
        backgroundColor: Colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    areaInfo: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
    },
    areaName: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    areaDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12,
    },
    areaFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    capacityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    capacityText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '500' as const,
    },
    reserveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    reserveButtonText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: Colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '500' as const,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '85%',
        paddingBottom: 20,
        overflow: 'hidden',
    },
    sheetIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 12,
    },
    heroSection: {
        width: '100%',
        height: 220,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    detailBody: {
        padding: 24,
    },
    detailName: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 8,
    },
    detailDesc: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
    },
    metaRowText: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '500' as const,
    },
    schedulesSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 16,
    },
    schedulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    scheduleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(13, 148, 136, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(13, 148, 136, 0.2)',
    },
    scheduleText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.primaryDark,
    },
    closeButton: {
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
    },
    // Reservation Card Styles
    reservationCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    reservationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    areaBadge: {
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    areaBadgeText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: Colors.primary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700' as const,
        textTransform: 'uppercase' as const,
    },
    reservationDetails: {
        flexDirection: 'row',
        gap: 20,
    },
    reservationInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reservationInfoText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500' as const,
    },
});

