import Colors from '@/constants/Colors';
import { goToProfile } from '@/navigation/routes';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bike,
    Car,
    LayoutGrid,
    Pencil,
    Plus,
    Search,
    Trash2,
    Truck,
    User,
    UserCircle,
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
    View,
} from 'react-native';
import { Vehiculo } from '../types/condominio';
import { useVehiculoViewModel } from '../viewmodels/UseVehiculoViewModel';

const VEHICLE_TYPES = [
    { label: 'Auto', value: 'AUTO', icon: Car },
    { label: 'Moto', value: 'MOTO', icon: Bike },
    { label: 'Camioneta', value: 'CAMIONETA', icon: Truck },
];

export default function VehiculoScreen() {
    const vm = useVehiculoViewModel();
    const router = useRouter();

    // El administrador puede gestionar en ambos modos. 
    // Seguridad solo ve (no gestiona). 
    // Residentes gestionan los suyos.
    const canManageForm = !vm.isSecurity;

    // Solo mostrar botones de acción (Edit/Delete) si es mi vehículo personal 
    // o si soy Admin viendo todos los vehículos.
    const showActions = (item: Vehiculo) => {
        if (vm.isSecurity) return false;
        if (vm.viewMode === 'PERSONAL') return true;
        return vm.isAdmin; // Admin gestiona todo en modo ALL
    };

    const renderVehicleItem = ({ item }: { item: Vehiculo }) => {
        const VehicleIcon = item.tipo === 'MOTO' ? Bike : item.tipo === 'CAMIONETA' ? Truck : Car;
        const hasActions = showActions(item);

        return (
            <View style={styles.vehicleCard}>
                <View style={styles.vehicleIconContainer}>
                    <VehicleIcon size={24} color={Colors.primary} />
                </View>
                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleTitle}>{item.marca} {item.modelo}</Text>
                    <Text style={styles.vehiclePlaca}>{item.placa}</Text>

                    {/* Show owner name if in ALL view mode */}
                    {vm.viewMode === 'ALL' && (
                        <View style={styles.ownerRow}>
                            <User size={12} color={Colors.textSecondary} />
                            <Text style={styles.ownerText}>{item.nombre} {item.apellidos}</Text>
                        </View>
                    )}

                    <View style={styles.vehicleTags}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.color}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.anio}</Text>
                        </View>
                    </View>
                </View>

                {hasActions && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            onPress={() => vm.handleEdit(item)}
                            style={styles.editButton}
                            activeOpacity={0.7}
                        >
                            <Pencil size={18} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => vm.handleDelete(item.id)}
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                        >
                            <Trash2 size={18} color={Colors.error} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Selector de Vista (Tabs): Solo Admin ve ambos tabs; Seguridad no tiene tabs */}
            {vm.isAdmin && (
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, vm.viewMode === 'ALL' && styles.activeTab]}
                        onPress={() => vm.setViewMode('ALL')}
                    >
                        <LayoutGrid size={18} color={vm.viewMode === 'ALL' ? Colors.surface : Colors.textSecondary} />
                        <Text style={[styles.tabText, vm.viewMode === 'ALL' && styles.activeTabText]}>Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, vm.viewMode === 'PERSONAL' && styles.activeTab]}
                        onPress={() => vm.setViewMode('PERSONAL')}
                    >
                        <UserCircle size={18} color={vm.viewMode === 'PERSONAL' ? Colors.surface : Colors.textSecondary} />
                        <Text style={[styles.tabText, vm.viewMode === 'PERSONAL' && styles.activeTabText]}>Mis Vehículos</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.header}>
                {/* Botón volver: oculto para Seguridad */}
                {!vm.isSecurity && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => goToProfile()}
                        activeOpacity={0.4}
                    >
                        <ArrowLeft size={24} color={Colors.text} />
                    </TouchableOpacity>
                )}
                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={vm.viewMode === 'ALL' ? "Buscar por placa, marca o residente..." : "Buscar placa o marca..."}
                        value={vm.searchQuery}
                        onChangeText={vm.setSearchQuery}
                        placeholderTextColor={Colors.textLight}
                    />
                </View>
                {canManageForm && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => { vm.resetForm(); vm.setShowForm(true); }}
                        activeOpacity={0.8}
                    >
                        <Plus size={24} color={Colors.surface} />
                    </TouchableOpacity>
                )}
            </View>

            {vm.isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={vm.vehiculos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderVehicleItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={vm.isRefreshing}
                            onRefresh={vm.refetch}
                            colors={[Colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Car size={48} color={Colors.textLight} />
                            <Text style={styles.emptyText}>
                                {vm.viewMode === 'ALL' ? 'No hay vehículos registrados' : 'No tienes vehículos registrados'}
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Modal de Registro */}
            <Modal
                visible={vm.showForm}
                animationType="slide"
                transparent
                onRequestClose={() => vm.setShowForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {vm.editingVehiculoId ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
                            </Text>
                            <TouchableOpacity onPress={() => vm.setShowForm(false)}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Selector de Tipo */}
                            <View style={styles.typeSelector}>
                                {VEHICLE_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = vm.tipo === type.value;
                                    return (
                                        <TouchableOpacity
                                            key={type.value}
                                            style={[
                                                styles.typeItem,
                                                isSelected && styles.typeItemSelected
                                            ]}
                                            onPress={() => vm.setTipo(type.value)}
                                        >
                                            <Icon size={18} color={isSelected ? Colors.surface : Colors.textSecondary} />
                                            <Text style={[
                                                styles.typeText,
                                                isSelected && styles.typeTextSelected
                                            ]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Marca *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: Honda, Toyota..."
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.marca}
                                    onChangeText={vm.setMarca}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Modelo *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: Civic, RAV4..."
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.modelo}
                                    onChangeText={vm.setModelo}
                                />
                            </View>

                            <View style={styles.rowFields}>
                                <View style={[styles.formField, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.fieldLabel}>Año</Text>
                                    <TextInput
                                        style={styles.fieldInput}
                                        placeholder="2024"
                                        placeholderTextColor={Colors.textLight}
                                        value={vm.anio}
                                        onChangeText={vm.setAnio}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={[styles.formField, { flex: 1 }]}>
                                    <Text style={styles.fieldLabel}>Color</Text>
                                    <TextInput
                                        style={styles.fieldInput}
                                        placeholder="Blanco"
                                        placeholderTextColor={Colors.textLight}
                                        value={vm.color}
                                        onChangeText={vm.setColor}
                                    />
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Placas *</Text>
                                <TextInput
                                    style={[styles.fieldInput, styles.placaInput]}
                                    placeholder="ABC-1234"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.placa}
                                    onChangeText={vm.setPlaca}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    (!vm.isFormValid || vm.isSaving) && styles.submitButtonDisabled
                                ]}
                                onPress={vm.handleSave}
                                disabled={!vm.isFormValid || vm.isSaving}
                                activeOpacity={0.8}
                            >
                                {vm.isSaving ? (
                                    <ActivityIndicator color={Colors.surface} size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {vm.editingVehiculoId ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
                                    </Text>
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
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: Colors.surfaceAlt,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activeTab: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    activeTabText: {
        color: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: Colors.text,
    },
    addButton: {
        width: 48,
        height: 48,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
        gap: 16,
    },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    vehicleIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(20, 184, 166, 0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    vehiclePlaca: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.primary,
        marginTop: 2,
    },
    ownerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    ownerText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    vehicleTags: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        backgroundColor: Colors.surfaceAlt,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
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
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.text,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    typeItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: Colors.surfaceAlt,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    typeItemSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    typeTextSelected: {
        color: Colors.surface,
    },
    formField: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    fieldInput: {
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    rowFields: {
        flexDirection: 'row',
    },
    placaInput: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        borderColor: Colors.text,
        borderWidth: 1.5,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 30,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitButtonDisabled: {
        backgroundColor: '#94a3b8',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: Colors.surface,
        fontSize: 16,
        fontWeight: '800',
    },
});
