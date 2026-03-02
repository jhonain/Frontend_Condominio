import Colors from '@/constants/Colors';
import {
    Bell,
    Calendar,
    Info,
    Plus,
    Shield,
    Wrench,
    X
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Aviso, TipoAviso } from '../types/condominio';
import { useAvisosViewModel } from '../viewmodels/UseAvisosViewModel';

const CATEGORIES: { label: string; value: TipoAviso | 'TODOS'; icon: any; color: string }[] = [
    { label: 'Todos', value: 'TODOS', icon: null, color: Colors.primary },
    { label: 'General', value: 'GENERAL', icon: Bell, color: '#0EA5E9' },
    { label: 'Mantenimiento', value: 'MANTENIMIENTO', icon: Wrench, color: '#F59E0B' },
    { label: 'Seguridad', value: 'SEGURIDAD', icon: Shield, color: '#EF4444' },
    { label: 'Evento', value: 'EVENTO', icon: Calendar, color: '#8B5CF6' },
];

export default function AvisosScreen() {
    const {
        isAdmin,
        avisos,
        isLoading,
        selectedTipo,
        setSelectedTipo,
        isModalVisible,
        setIsModalVisible,
        newAviso,
        setNewAviso,
        handleCreateAviso,
        isCreating
    } = useAvisosViewModel();

    const renderAvisoItem = ({ item }: { item: Aviso }) => {
        const category = CATEGORIES.find(c => c.value === item.TipoAviso) || CATEGORIES[1];
        const IconComponent = category.icon || Bell;

        return (
            <View style={[styles.card, item.importante && styles.importantCard]}>
                {item.importante && (
                    <View style={styles.importantBadge}>
                        <Info size={14} color="#FFF" />
                        <Text style={styles.importantBadgeText}>Importante</Text>
                    </View>
                )}

                <View style={styles.cardHeader}>
                    <View style={styles.categoryInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
                            <IconComponent size={18} color={category.color} />
                        </View>
                        <View style={[styles.categoryBadge, { backgroundColor: category.color + '10' }]}>
                            <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
                        </View>
                    </View>
                    <Text style={styles.dateText}>{item.fechaAviso || 'Hoy'}</Text>
                </View>

                <Text style={styles.avisoTitle}>{item.titulo}</Text>
                <Text style={styles.avisoDesc} numberOfLines={3}>{item.descripcion}</Text>

                <TouchableOpacity style={styles.verMasButton}>
                    <Text style={styles.verMasText}>Ver más</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Filters */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {CATEGORIES.slice(0, 5).map((cat) => (
                        <TouchableOpacity
                            key={cat.value}
                            onPress={() => setSelectedTipo(cat.value)}
                            style={[
                                styles.filterButton,
                                selectedTipo === cat.value && styles.filterButtonActive
                            ]}
                        >
                            <Text style={[
                                styles.filterButtonText,
                                selectedTipo === cat.value && styles.filterButtonTextActive
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {isAdmin && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Plus size={24} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={avisos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAvisoItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Bell size={48} color="#CBD5E1" />
                            <Text style={styles.emptyText}>No hay avisos disponibles</Text>
                        </View>
                    }
                />
            )}

            {/* Modal para Nuevo Aviso */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo Aviso</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X size={24} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                            <Text style={styles.inputLabel}>Título *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Título del aviso"
                                value={newAviso.titulo}
                                onChangeText={(text) => setNewAviso({ ...newAviso, titulo: text })}
                            />

                            <Text style={styles.inputLabel}>Contenido *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Descripción del aviso..."
                                multiline
                                numberOfLines={4}
                                value={newAviso.descripcion}
                                onChangeText={(text) => setNewAviso({ ...newAviso, descripcion: text })}
                            />

                            <Text style={styles.inputLabel}>Categoría</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.filter(c => c.value !== 'TODOS').map((cat) => (
                                    <TouchableOpacity
                                        key={cat.value}
                                        onPress={() => setNewAviso({ ...newAviso, TipoAviso: cat.value as TipoAviso })}
                                        style={[
                                            styles.categoryOption,
                                            newAviso.TipoAviso === cat.value && { backgroundColor: Colors.primary }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.categoryOptionText,
                                            newAviso.TipoAviso === cat.value && { color: '#FFF' }
                                        ]}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Marcar como importante</Text>
                                <Switch
                                    value={newAviso.importante}
                                    onValueChange={(val) => setNewAviso({ ...newAviso, importante: val })}
                                    trackColor={{ false: '#CBD5E1', true: Colors.primary + '80' }}
                                    thumbColor={newAviso.importante ? Colors.primary : '#F1F5F9'}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
                                onPress={handleCreateAviso}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Publicar Aviso</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    filterScroll: {
        gap: 10,
        paddingRight: 60,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    filterButtonTextActive: {
        color: '#FFF',
    },
    addButton: {
        position: 'absolute',
        right: 15,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    listContainer: {
        padding: 15,
        gap: 15,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    importantCard: {
        borderColor: '#EF444450',
        borderWidth: 1.5,
    },
    importantBadge: {
        position: 'absolute',
        top: -10,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 5,
    },
    importantBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    avisoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    avisoDesc: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 15,
    },
    verMasButton: {
        alignSelf: 'flex-start',
    },
    verMasText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        gap: 15,
    },
    emptyText: {
        fontSize: 16,
        color: '#94A3B8',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    modalForm: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    categoryOption: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    switchLabel: {
        fontSize: 15,
        color: '#1E293B',
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
