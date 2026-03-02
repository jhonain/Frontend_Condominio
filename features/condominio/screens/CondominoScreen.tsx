import {
    ArrowLeft,
    Building2,
    Camera,
    Check,
    Clock,
    Home,
    Image as ImageIcon,
    Layout,
    MapPin,
    Plus,
    Trash2,
    User,
    Users,
    X
} from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Image,
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

import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useCondominioViewModel } from '../viewmodels/UseRegisterCondominioViewModel';

export default function CondominioScreen() {
    const vm = useCondominioViewModel();
    const { isAdmin } = useAuth();

    if (vm.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {vm.selectedCondo ? (
                // Vista de Detalle (Unidades)
                <View style={styles.detailContainer}>
                    <View style={styles.detailHeader}>
                        <TouchableOpacity
                            onPress={() => vm.handleSelectCondo(null)}
                            style={styles.backButton}
                        >
                            <ArrowLeft size={22} color={Colors.text} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.detailTitle}>{vm.selectedCondo.nombre}</Text>
                            <Text style={styles.detailSubtitle}>Catálogo de Unidades</Text>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.unitsScroll}
                        contentContainerStyle={styles.unitsScrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {isAdmin && (
                            <TouchableOpacity
                                style={styles.addUnitButton}
                                onPress={() => vm.handleAddUnits(vm.selectedCondo!.id)}
                            >
                                <Plus size={20} color={Colors.primary} />
                                <Text style={styles.addUnitText}>Agregar Nueva Unidad</Text>
                            </TouchableOpacity>
                        )}

                        {vm.selectedCondo.unidades && vm.selectedCondo.unidades.length > 0 ? (
                            vm.selectedCondo.unidades.map((unidad) => (
                                <View key={unidad.id} style={styles.unitCard}>
                                    <View style={styles.unitInfo}>
                                        <View style={styles.unitMainInfo}>
                                            <View style={styles.unitIconContainer}>
                                                <Layout size={18} color={Colors.primary} />
                                            </View>
                                            <View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text style={styles.unitCode}>{unidad.codigo}</Text>
                                                    <View style={[
                                                        styles.unitStatusBadge,
                                                        { backgroundColor: unidad.estado === 'DISPONIBLE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
                                                    ]}>
                                                        <Text style={[
                                                            styles.unitStatusText,
                                                            { color: unidad.estado === 'DISPONIBLE' ? Colors.success : Colors.error }
                                                        ]}>
                                                            {unidad.estado}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.unitMeta}>Piso {unidad.piso} • {unidad.areaM2}m²</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', gap: 8 }}>
                                            <View style={styles.unitPriceContainer}>
                                                <Text style={styles.unitPriceLabel}>Mensualidad</Text>
                                                <Text style={styles.unitPriceValue}>S/ {unidad.precioMensual}</Text>
                                            </View>
                                            {isAdmin && unidad.estado === 'DISPONIBLE' && (
                                                <TouchableOpacity
                                                    style={styles.assignSmallButton}
                                                    onPress={() => vm.handleOpenAssign(unidad.id)}
                                                >
                                                    <User size={14} color={Colors.surface} />
                                                    <Text style={styles.assignSmallButtonText}>Asignar</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={[styles.emptyContainer, { marginTop: 40 }]}>
                                <Layout size={48} color={Colors.textLight} />
                                <Text style={styles.emptyText}>Aún no hay unidades en este condominio</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            ) : (
                // Vista Principal de Listado
                <>
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            style={[styles.tab, vm.activeTab === 'condominiums' && styles.tabActive]}
                            onPress={() => vm.setActiveTab('condominiums')}
                        >
                            <Building2 size={16} color={vm.activeTab === 'condominiums' ? Colors.surface : Colors.textSecondary} />
                            <Text style={[styles.tabText, vm.activeTab === 'condominiums' && styles.tabTextActive]}>
                                Condominios
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, vm.activeTab === 'areas' && styles.tabActive]}
                            onPress={() => vm.setActiveTab('areas')}
                        >
                            <Home size={16} color={vm.activeTab === 'areas' ? Colors.surface : Colors.textSecondary} />
                            <Text style={[styles.tabText, vm.activeTab === 'areas' && styles.tabTextActive]}>
                                Áreas Comunes
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={vm.isRefreshing}
                                onRefresh={vm.refreshCondos}
                                colors={[Colors.primary]}
                            />
                        }
                    >
                        {vm.activeTab === 'condominiums' ? (
                            <>
                                {isAdmin && (
                                    <TouchableOpacity
                                        style={styles.addCard}
                                        onPress={() => vm.setShowCondoForm(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Plus size={20} color={Colors.primary} />
                                        <Text style={styles.addCardText}>Registrar Condominio</Text>
                                    </TouchableOpacity>
                                )}

                                {vm.condominiums.length > 0 ? (
                                    vm.condominiums.map((condo) => (
                                        <TouchableOpacity
                                            key={condo.id}
                                            style={styles.condoCard}
                                            onPress={() => vm.handleSelectCondo(condo.id)}
                                            activeOpacity={0.9}
                                        >
                                            {condo.imagenUrl ? (
                                                <Image source={{ uri: condo.imagenUrl }} style={styles.condoImage} />
                                            ) : (
                                                <View style={[styles.condoImage, { backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }]}>
                                                    <Building2 size={48} color={Colors.textLight} />
                                                </View>
                                            )}
                                            <View style={styles.condoInfo}>
                                                <View style={styles.condoHeader}>
                                                    <Text style={styles.condoName}>{condo.nombre}</Text>
                                                    <View style={[
                                                        styles.statusBadge,
                                                        { backgroundColor: condo.estado ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' },
                                                    ]}>
                                                        <Text style={[
                                                            styles.statusText,
                                                            { color: condo.estado ? Colors.success : Colors.error },
                                                        ]}>
                                                            {condo.estado ? 'Activo' : 'Inactivo'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.condoDetail}>
                                                    <MapPin size={14} color={Colors.textLight} />
                                                    <Text style={styles.condoDetailText} numberOfLines={1}>{condo.direccion}</Text>
                                                </View>
                                                <View style={styles.condoMeta}>
                                                    <View style={styles.metaItem}>
                                                        <Users size={14} color={Colors.primary} />
                                                        <Text style={styles.metaText}>{condo.totalUnidades} unidades</Text>
                                                    </View>
                                                    <View style={styles.metaItem}>
                                                        <Home size={14} color={Colors.primary} />
                                                        <Text style={styles.metaText}>{condo.unidades?.length ?? 0} registradas</Text>
                                                    </View>

                                                    {isAdmin && (
                                                        <View style={styles.actionButtons}>
                                                            <TouchableOpacity
                                                                onPress={(e) => {
                                                                    e.stopPropagation();
                                                                    vm.handleAddUnits(condo.id);
                                                                }}
                                                                style={styles.actionButton}
                                                            >
                                                                <Plus size={18} color={Colors.primary} />
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                onPress={(e) => {
                                                                    e.stopPropagation();
                                                                    vm.handleDeleteCondo(condo.id);
                                                                }}
                                                                style={styles.actionButton}
                                                            >
                                                                <Trash2 size={16} color={Colors.error} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Building2 size={48} color={Colors.textLight} />
                                        <Text style={styles.emptyText}>No hay condominios registrados</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                {isAdmin && (
                                    <TouchableOpacity
                                        style={styles.addCard}
                                        onPress={() => vm.setShowAreaForm(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Plus size={20} color={Colors.primary} />
                                        <Text style={styles.addCardText}>Registrar Área Común</Text>
                                    </TouchableOpacity>
                                )}

                                {vm.commonAreas.length > 0 ? (
                                    vm.commonAreas.map((area) => (
                                        <View key={area.id} style={styles.condoCard}>
                                            {area.imagenUrl ? (
                                                <Image source={{ uri: area.imagenUrl }} style={styles.condoImage} />
                                            ) : (
                                                <View style={[styles.condoImage, { backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }]}>
                                                    <Home size={48} color={Colors.textLight} />
                                                </View>
                                            )}
                                            <View style={styles.condoInfo}>
                                                <View style={styles.condoHeader}>
                                                    <Text style={styles.condoName}>{area.nombre}</Text>
                                                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                                                        <Text style={[styles.statusText, { color: Colors.success }]}>{area.estado}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.areaDescription} numberOfLines={2}>{area.descripcion}</Text>
                                                <View style={styles.condoMeta}>
                                                    <View style={styles.metaItem}>
                                                        <Users size={14} color={Colors.primary} />
                                                        <Text style={styles.metaText}>Cap: {area.capacidad}</Text>
                                                    </View>
                                                    <View style={styles.metaItem}>
                                                        <Clock size={14} color={Colors.primary} />
                                                        <Text style={styles.metaText}>{area.horarios.length} horarios</Text>
                                                    </View>
                                                    {isAdmin && (
                                                        <View style={styles.actionButtons}>
                                                            <TouchableOpacity onPress={() => vm.handleDeleteArea(area.id)}>
                                                                <Trash2 size={16} color={Colors.error} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.emptyContainer}>
                                        <Home size={48} color={Colors.textLight} />
                                        <Text style={styles.emptyText}>No hay áreas comunes registradas</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </>
            )}

            <Modal
                visible={vm.showCondoForm}
                animationType="slide"
                transparent
                onRequestClose={() => vm.setShowCondoForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nuevo Condominio</Text>
                            <TouchableOpacity onPress={() => { vm.resetCondoForm(); vm.setShowCondoForm(false); }}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Selector de Imagen */}
                            <View style={styles.imagePickerContainer}>
                                <Text style={styles.fieldLabel}>Imagen del Condominio</Text>
                                {vm.condoImage ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: vm.condoImage }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.removeImageBtn}
                                            onPress={() => vm.resetCondoForm()}
                                        >
                                            <X size={16} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.imagePickerOptions}>
                                        <TouchableOpacity style={styles.imagePickerBtn} onPress={vm.pickImage}>
                                            <ImageIcon size={24} color={Colors.primary} />
                                            <Text style={styles.imagePickerBtnText}>Galería</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.imagePickerBtn} onPress={vm.takePhoto}>
                                            <Camera size={24} color={Colors.primary} />
                                            <Text style={styles.imagePickerBtnText}>Cámara</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Nombre *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: Residencial Los Pinos"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.condoName}
                                    onChangeText={vm.setCondoName}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Dirección *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Av. Reforma 1234, Chiclayo"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.condoAddress}
                                    onChangeText={vm.setCondoAddress}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Total de Unidades</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="80"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.condoUnits}
                                    onChangeText={vm.setCondoUnits}
                                    keyboardType="numeric"
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.submitButton, (!vm.isCondoFormValid || vm.isAddingCondo) && styles.submitButtonDisabled]}
                                onPress={vm.handleAddCondo}
                                disabled={!vm.isCondoFormValid || vm.isAddingCondo}
                                activeOpacity={0.8}
                            >
                                {vm.isAddingCondo ? (
                                    <ActivityIndicator color={Colors.surface} size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Registrar Condominio</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                visible={vm.showAreaForm}
                animationType="slide"
                transparent
                onRequestClose={() => vm.setShowAreaForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nueva Área Común</Text>
                            <TouchableOpacity onPress={() => { vm.resetAreaForm(); vm.setShowAreaForm(false); }}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Condominio *</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.condoSelector}>
                                    {vm.condominiums.map((condo) => (
                                        <TouchableOpacity
                                            key={condo.id}
                                            style={[
                                                styles.condoSelectItem,
                                                vm.areaCondoId === condo.id && styles.condoSelectItemSelected
                                            ]}
                                            onPress={() => vm.setAreaCondoId(condo.id)}
                                        >
                                            <Text style={[
                                                styles.condoSelectItemText,
                                                vm.areaCondoId === condo.id && styles.condoSelectItemTextSelected
                                            ]}>
                                                {condo.nombre}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Nombre *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: Salón de Eventos"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.areaName}
                                    onChangeText={vm.setAreaName}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Descripción</Text>
                                <TextInput
                                    style={[styles.fieldInput, { height: 80, textAlignVertical: 'top' }]}
                                    placeholder="Descripción del área..."
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.areaDescription}
                                    onChangeText={vm.setAreaDescription}
                                    multiline
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Capacidad</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="20"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.areaCapacity}
                                    onChangeText={vm.setAreaCapacity}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formField}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.fieldLabel}>Horarios</Text>
                                    <TouchableOpacity onPress={vm.handleAddHorario} style={styles.addHorarioBtn}>
                                        <Plus size={16} color={Colors.primary} />
                                        <Text style={styles.addHorarioText}>Agregar</Text>
                                    </TouchableOpacity>
                                </View>

                                {vm.areaHorarios.map((horario, index) => (
                                    <View key={index} style={styles.horarioRow}>
                                        <TextInput
                                            style={[styles.fieldInput, styles.horarioInput]}
                                            placeholder="09:00"
                                            value={horario.horaInicio}
                                            onChangeText={(val) => vm.handleUpdateHorario(index, 'horaInicio', val)}
                                        />
                                        <Text style={styles.horarioSeparator}>a</Text>
                                        <TextInput
                                            style={[styles.fieldInput, styles.horarioInput]}
                                            placeholder="12:00"
                                            value={horario.horaFin}
                                            onChangeText={(val) => vm.handleUpdateHorario(index, 'horaFin', val)}
                                        />
                                        <TouchableOpacity
                                            onPress={() => vm.handleRemoveHorario(index)}
                                            style={styles.removeHorarioBtn}
                                        >
                                            <Trash2 size={16} color={Colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={[styles.submitButton, (!vm.isAreaFormValid || vm.isAddingArea) && styles.submitButtonDisabled]}
                                onPress={vm.handleAddArea}
                                disabled={!vm.isAreaFormValid || vm.isAddingArea}
                                activeOpacity={0.8}
                            >
                                {vm.isAddingArea ? (
                                    <ActivityIndicator color={Colors.surface} size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Registrar Área Común</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                visible={vm.showUnidadForm}
                animationType="slide"
                transparent
                onRequestClose={() => vm.setShowUnidadForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nueva Unidad</Text>
                            <TouchableOpacity onPress={() => { vm.resetUnidadForm(); vm.setShowUnidadForm(false); }}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Código de Unidad *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: E-103"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.unidadCodigo}
                                    onChangeText={vm.setUnidadCodigo}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Piso *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: 1"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.unidadPiso}
                                    onChangeText={vm.setUnidadPiso}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Área (m2) *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: 70"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.unidadArea}
                                    onChangeText={vm.setUnidadArea}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.fieldLabel}>Precio Mensual *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="Ej: 750.0"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.unidadPrecio}
                                    onChangeText={vm.setUnidadPrecio}
                                    keyboardType="numeric"
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.submitButton, (!vm.isUnidadFormValid || vm.isAddingUnidad) && styles.submitButtonDisabled]}
                                onPress={vm.handleCreateUnidad}
                                disabled={!vm.isUnidadFormValid || vm.isAddingUnidad}
                                activeOpacity={0.8}
                            >
                                {vm.isAddingUnidad ? (
                                    <ActivityIndicator color={Colors.surface} size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Registrar Unidad</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                visible={vm.showAssignForm}
                animationType="slide"
                transparent
                onRequestClose={() => vm.setShowAssignForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Asignar Residente</Text>
                                <Text style={styles.modalSubtitle}>Selecciona una persona para esta unidad</Text>
                            </View>
                            <TouchableOpacity onPress={() => vm.setShowAssignForm(false)}>
                                <X size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.formField, { flex: 0 }]}>
                            <Text style={styles.fieldLabel}>Residente *</Text>
                            {vm.isLoadingPersonas ? (
                                <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
                            ) : (
                                <ScrollView style={styles.personaList} showsVerticalScrollIndicator={false}>
                                    {vm.personas.map((persona: any) => (
                                        <TouchableOpacity
                                            key={persona.id}
                                            style={[
                                                styles.personaItem,
                                                vm.selectedPersonaId === persona.id && styles.personaItemSelected
                                            ]}
                                            onPress={() => vm.setSelectedPersonaId(persona.id)}
                                        >
                                            <View style={styles.personaAvatar}>
                                                <User size={20} color={vm.selectedPersonaId === persona.id ? Colors.surface : Colors.textSecondary} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[
                                                    styles.personaName,
                                                    vm.selectedPersonaId === persona.id && styles.personaNameSelected
                                                ]}>
                                                    {persona.nombre} {persona.apellidos}
                                                </Text>
                                                <Text style={[
                                                    styles.personaEmail,
                                                    vm.selectedPersonaId === persona.id && styles.personaEmailSelected
                                                ]}>
                                                    {persona.email}
                                                </Text>
                                            </View>
                                            {vm.selectedPersonaId === persona.id && (
                                                <Check size={20} color={Colors.surface} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.formField}>
                            <Text style={styles.fieldLabel}>Rol en la unidad</Text>
                            <View style={styles.roleTabs}>
                                {['Inquilino', 'Propietario'].map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[styles.roleTab, vm.assignRol === role && styles.roleTabActive]}
                                        onPress={() => vm.setAssignRol(role)}
                                    >
                                        <Text style={[styles.roleTabText, vm.assignRol === role && styles.roleTabTextActive]}>
                                            {role}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.dateRow}>
                            <View style={[styles.formField, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.fieldLabel}>Fecha Inicio *</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.assignFechaInicio}
                                    onChangeText={vm.setAssignFechaInicio}
                                />
                            </View>
                            <View style={[styles.formField, { flex: 1 }]}>
                                <Text style={styles.fieldLabel}>Fecha Fin (Opcional)</Text>
                                <TextInput
                                    style={styles.fieldInput}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={Colors.textLight}
                                    value={vm.assignFechaFin}
                                    onChangeText={vm.setAssignFechaFin}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, (!vm.selectedPersonaId || vm.isAssigning) && styles.submitButtonDisabled]}
                            onPress={vm.handleAssignPersona}
                            disabled={!vm.selectedPersonaId || vm.isAssigning}
                        >
                            {vm.isAssigning ? (
                                <ActivityIndicator color={Colors.surface} size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Confirmar Asignación</Text>
                            )}
                        </TouchableOpacity>
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
    dateRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tabActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
    },
    tabTextActive: {
        color: Colors.surface,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    addCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
    },
    addCardText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.primary,
    },
    condoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    condoImage: {
        width: '100%',
        height: 140,
    },
    condoInfo: {
        padding: 16,
    },
    condoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    condoName: {
        fontSize: 17,
        fontWeight: '700' as const,
        color: Colors.text,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600' as const,
    },
    condoDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    condoDetailText: {
        fontSize: 13,
        color: Colors.textSecondary,
        flex: 1,
    },
    areaDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 10,
        lineHeight: 20,
    },
    condoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500' as const,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginLeft: 'auto',
    },
    actionButton: {
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    formField: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    fieldInput: {
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    submitButtonDisabled: {
        backgroundColor: Colors.textLight,
    },
    submitButtonText: {
        color: Colors.surface,
        fontSize: 16,
        fontWeight: '700' as const,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        color: Colors.textLight,
        fontWeight: '600' as const,
    },
    detailContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: Colors.surfaceAlt,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    detailSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    unitsScroll: {
        flex: 1,
    },
    unitsScrollContent: {
        padding: 20,
        gap: 12,
    },
    addUnitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: Colors.surface,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        gap: 8,
        marginBottom: 8,
    },
    addUnitText: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: Colors.primary,
    },
    unitCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    unitInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    unitMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    unitIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unitCode: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    unitMeta: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    unitPriceContainer: {
        alignItems: 'flex-end',
    },
    unitPriceLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    unitPriceValue: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: Colors.primary,
        marginTop: 2,
    },
    unitStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    unitStatusText: {
        fontSize: 10,
        fontWeight: '700' as const,
        textTransform: 'uppercase',
    },
    assignSmallButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    assignSmallButtonText: {
        color: Colors.surface,
        fontSize: 12,
        fontWeight: '600' as const,
    },
    modalSubtitle: {
        fontSize: 13,
        color: Colors.textLight,
        marginTop: 4,
    },
    personaList: {
        maxHeight: 320,
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 16,
        padding: 4,
        marginTop: 4,
    },
    personaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        gap: 14,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    personaItemSelected: {
        backgroundColor: Colors.primary,
    },
    personaAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    personaName: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    personaNameSelected: {
        color: Colors.surface,
    },
    personaEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    personaEmailSelected: {
        color: 'rgba(255,255,255,0.8)',
    },
    roleTabs: {
        flexDirection: 'row',
        gap: 12,
    },
    roleTab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: Colors.surfaceAlt,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    roleTabActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    roleTabText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: Colors.textSecondary,
    },
    roleTabTextActive: {
        color: Colors.surface,
    },
    // Nuevos estilos para Áreas Comunes
    condoSelector: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    condoSelectItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.surfaceAlt,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    condoSelectItemSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    condoSelectItemText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '600' as const,
    },
    condoSelectItemTextSelected: {
        color: Colors.surface,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addHorarioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addHorarioText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '600' as const,
    },
    horarioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    horarioInput: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 8,
    },
    horarioSeparator: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    removeHorarioBtn: {
        padding: 8,
    },
    // Estilos para Image Picker
    imagePickerContainer: {
        marginBottom: 24,
    },
    imagePickerOptions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    imagePickerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(20, 184, 166, 0.05)',
        borderRadius: 12,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    imagePickerBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginTop: 8,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    imagePreview: {
        width: '100%',
        height: 180,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

