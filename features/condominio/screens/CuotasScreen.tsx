import Colors from '@/constants/Colors';
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    Info,
    MessageSquare,
    Search,
    User,
    Wallet,
    X
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Cuota, MetodoPago } from '../types/condominio';
import { useCuotasViewModel } from '../viewmodels/UseCuotasViewModel';
import { useProfileViewModel } from '../viewmodels/UseProfileViewModel';

const getStatusStyles = (estado: Cuota['estado']) => {
    switch (estado) {
        case 'PAGADO':
            return {
                bg: '#DCFCE7',
                text: '#166534',
                icon: <CheckCircle2 size={14} color="#166534" />,
            };
        case 'VENCIDO':
            return {
                bg: '#FEE2E2',
                text: '#991B1B',
                icon: <Info size={14} color="#991B1B" />,
            };
        default:
            return {
                bg: '#FEF3C7',
                text: '#92400E',
                icon: <Clock size={14} color="#92400E" />,
            };
    }
};

const METODOS_PAGO: { label: string, value: MetodoPago }[] = [
    { label: 'Yape', value: 'YAPE' },
    { label: 'Plin', value: 'PLIN' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' },
    { label: 'Depósito', value: 'DEPOSITO' },
    { label: 'Efectivo', value: 'EFECTIVO' },
];

export default function CuotasScreen() {
    const vmp = useProfileViewModel();
    const {
        cuotas,
        isLoading: isLoadingCuotas,
        refetch,
        isAdmin,
        searchQuery,
        setSearchQuery,
        showPaymentModal,
        setShowPaymentModal,
        metodoPago,
        setMetodoPago,
        observacion,
        setObservacion,
        handleOpenPayment,
        handleConfirmPayment,
        isPaying
    } = useCuotasViewModel();

    const isLoading = isLoadingCuotas || vmp.isLoading;

    const renderCuotaItem = ({ item }: { item: Cuota }) => {
        const status = getStatusStyles(item.estado);
        const canPay = !isAdmin && (item.estado === 'PENDIENTE' || item.estado === 'VENCIDO');

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.cuotaBadge}>
                        <Text style={styles.cuotaBadgeText}>ID: {item.id} • Cuota #{item.numeroCuota}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        {status.icon}
                        <Text style={[styles.statusBadgeText, { color: status.text }]}>{item.estado}</Text>
                    </View>
                </View>

                {isAdmin && (
                    <View style={styles.adminInfoRow}>
                        <View style={styles.adminInfoItem}>
                            <User size={14} color={Colors.primary} />
                            <Text style={styles.adminInfoText} numberOfLines={1}>
                                {isAdmin
                                    ? (`${item.nombreResidente}`.trim() || 'Residente')
                                    : (vmp.displayName || 'Mi Cuota')}
                            </Text>
                        </View>
                        {item.unidadCodigo && (
                            <View style={styles.adminInfoItem}>
                                <Building2 size={14} color={Colors.secondary} />
                                <Text style={styles.adminInfoText}>{item.unidadCodigo}</Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Monto</Text>
                    <Text style={styles.amountValue}>S/ {item.monto.toFixed(2)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Calendar size={16} color={Colors.textSecondary} />
                        <View>
                            <Text style={styles.detailLabel}>Vencimiento</Text>
                            <Text style={styles.detailValue}>{item.fechaVencimiento || '---'}</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <CreditCard size={16} color={Colors.textSecondary} />
                        <View>
                            <Text style={styles.detailLabel}>Método</Text>
                            <Text style={styles.detailValue}>{item.metodoPago || '---'}</Text>
                        </View>
                    </View>
                </View>

                {item.fechaPago ? (
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentInfoText}>
                            Pagado el {item.fechaPago}
                        </Text>
                    </View>
                ) : (
                    canPay && (
                        <TouchableOpacity
                            style={styles.payButton}
                            onPress={() => handleOpenPayment(item.id)}
                            activeOpacity={0.8}
                        >
                            <Wallet size={18} color={Colors.surface} />
                            <Text style={styles.payButtonText}>Registrar Pago</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 15 }} />

            {isAdmin && (
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color={Colors.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por nombre, unidad o estado..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={Colors.textLight}
                        />
                    </View>
                </View>
            )}

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={cuotas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCuotaItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[Colors.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <CreditCard size={48} color={Colors.textLight} />
                            <Text style={styles.emptyText}>
                                {searchQuery ? 'No se encontraron resultados' : 'No hay cuotas registradas'}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Modal de Pago */}
            <Modal
                visible={showPaymentModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Registrar Pago</Text>
                                <Text style={styles.modalSubtitle}>Selecciona el medio de pago utilizado</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Método de Pago</Text>
                                <View style={styles.methodsGrid}>
                                    {METODOS_PAGO.map((metodo) => (
                                        <TouchableOpacity
                                            key={metodo.value}
                                            style={[
                                                styles.methodItem,
                                                metodoPago === metodo.value && styles.methodItemSelected
                                            ]}
                                            onPress={() => setMetodoPago(metodo.value)}
                                        >
                                            <Text style={[
                                                styles.methodText,
                                                metodoPago === metodo.value && styles.methodTextSelected
                                            ]}>
                                                {metodo.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Observación (Opcional)</Text>
                                <View style={styles.textAreaContainer}>
                                    <MessageSquare size={18} color={Colors.textLight} style={styles.textAreaIcon} />
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder="Ej: Pago realizado via app móvil..."
                                        placeholderTextColor={Colors.textLight}
                                        value={observacion}
                                        onChangeText={setObservacion}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.confirmButton, isPaying && styles.confirmButtonDisabled]}
                                onPress={handleConfirmPayment}
                                disabled={isPaying}
                                activeOpacity={0.8}
                            >
                                {isPaying ? (
                                    <ActivityIndicator color={Colors.surface} size="small" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} color={Colors.surface} />
                                        <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: Colors.text,
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
        gap: 16,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 20,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cuotaBadge: {
        backgroundColor: Colors.surfaceAlt,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cuotaBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 6,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    adminInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    adminInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    adminInfoText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
    },
    amountContainer: {
        marginBottom: 16,
    },
    amountLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    amountValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    detailLabel: {
        fontSize: 10,
        color: Colors.textLight,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
    },
    paymentInfo: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    paymentInfoText: {
        fontSize: 13,
        color: Colors.success,
        fontWeight: '600',
        textAlign: 'center',
    },
    payButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 18,
        paddingVertical: 12,
        borderRadius: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonText: {
        color: Colors.surface,
        fontSize: 15,
        fontWeight: '700',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        gap: 16,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.textLight,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.text,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    formField: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    methodsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    methodItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surfaceAlt,
    },
    methodItemSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    methodText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    methodTextSelected: {
        color: Colors.surface,
    },
    textAreaContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 12,
    },
    textAreaIcon: {
        marginTop: 3,
        marginRight: 10,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        marginBottom: 30,
        paddingVertical: 16,
        borderRadius: 18,
    },
    confirmButtonDisabled: {
        opacity: 0.6,
    },
    confirmButtonText: {
        color: Colors.surface,
        fontSize: 16,
        fontWeight: '800',
    },
});
