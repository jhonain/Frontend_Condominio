import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Building2, Lock, User, Mail, Phone, CreditCard, Calendar, Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRegisterPersonaViewModel } from "../viewmodels/useRegisterPersonaViewModel";
import Colors from "@/constants/Colors";
import { goToLogin } from "@/navigation/routes";

export default function RegisterPersonaScreen() {
  const insets = useSafeAreaInsets();
  const {
    nombre, setNombre,
    apellidos, setApellidos,
    email, setEmail,
    telefono, setTelefono,
    fechaNac, setFechaNac,
    numeroDoc, setNumeroDoc,
    username, setUsername,
    password, setPassword,
    tipoDocumentos,
    tipoDocumentoId, setTipoDocumentoId,
    loading, error, onSubmit,
  } = useRegisterPersonaViewModel();

  const [showPassword, setShowPassword] = useState(false);

  // ── Animaciones ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <LinearGradient
        colors={["#0D9488", "#0F766E", "#115E59"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Círculos decorativos */}
      <View style={styles.patternOverlay}>
        <View style={[styles.patternCircle, styles.circle1]} />
        <View style={[styles.patternCircle, styles.circle2]} />
        <View style={[styles.patternCircle, styles.circle3]} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoContainer}>
              <Building2 size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>MiCondominio</Text>
            <Text style={styles.appTagline}>Crea tu cuenta</Text>
          </Animated.View>

          {/* Card */}
          <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.welcomeTitle}>Registro</Text>
            <Text style={styles.welcomeSubtitle}>Completa tus datos para registrarte</Text>

            {/* Error */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* ── Datos Personales ── */}
            <Text style={styles.sectionLabel}>Datos Personales</Text>
            <View style={styles.inputGroup}>

              {/* Nombre */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><User size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={Colors.dark.textLight}
                  value={nombre} onChangeText={setNombre} editable={!loading} />
              </View>

              {/* Apellidos */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><User size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Apellidos" placeholderTextColor={Colors.dark.textLight}
                  value={apellidos} onChangeText={setApellidos} editable={!loading} />
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Mail size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.dark.textLight}
                  value={email} onChangeText={setEmail} keyboardType="email-address"
                  autoCapitalize="none" editable={!loading} />
              </View>

              {/* Teléfono */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Phone size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={Colors.dark.textLight}
                  value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" editable={!loading}
                  maxLength={9}  />
              </View>

              {/* Fecha Nacimiento */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Calendar size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Fecha Nac. (dd/MM/yyyy)"
                  placeholderTextColor={Colors.dark.textLight}
                  value={fechaNac} onChangeText={setFechaNac} editable={!loading} />
              </View>

              {/* Tipo Documento - Combobox */}
              <View style={styles.pickerWrapper}>
                <View style={styles.inputIcon}><CreditCard size={18} color={Colors.dark.textMuted} /></View>
                <Picker
                  selectedValue={tipoDocumentoId}
                  onValueChange={(value) => setTipoDocumentoId(value)}
                  style={styles.picker}
                  enabled={!loading}
                >
                  {Array.isArray(tipoDocumentos) && tipoDocumentos.map((tipo) => (
                    <Picker.Item key={tipo.id} label={tipo.nombre} value={tipo.id} />
                  ))}
                </Picker>
              </View>

              {/* Número Documento */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><CreditCard size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Número de documento"
                  placeholderTextColor={Colors.dark.textLight}
                  value={numeroDoc} onChangeText={setNumeroDoc} keyboardType="numeric" editable={!loading} 
                  maxLength={8} />
              </View>
            </View>

            {/* ── Datos de Cuenta ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Datos de Cuenta</Text>
            <View style={styles.inputGroup}>

              {/* Username */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><User size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor={Colors.dark.textLight}
                  value={username} onChangeText={setUsername} autoCapitalize="none" editable={!loading} />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Lock size={18} color={Colors.dark.textMuted} /></View>
                <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={Colors.dark.textLight}
                  value={password} onChangeText={setPassword} secureTextEntry={!showPassword} editable={!loading} />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color={Colors.dark.textMuted} /> : <Eye size={18} color={Colors.dark.textMuted} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Registrar */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={onSubmit} disabled={loading} activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" size="small" />
                : <Text style={styles.loginButtonText}>Crear Cuenta</Text>
              }
            </TouchableOpacity>

            {/* Link volver al login */}
            <TouchableOpacity onPress={() => goToLogin()} style={styles.backLink}>
              <Text style={styles.backLinkText}>¿Ya tienes cuenta? <Text style={styles.backLinkBold}>Inicia sesión</Text></Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>© 2026 Condominio PAF</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  patternOverlay: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  patternCircle: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.05)" },
  circle1: { width: 300, height: 300, top: -80, right: -60 },
  circle2: { width: 200, height: 200, bottom: 120, left: -80 },
  circle3: { width: 140, height: 140, top: "40%", right: -40 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  logoSection: { alignItems: "center", marginBottom: 30 },
  logoContainer: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  appName: { fontSize: 30, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5 },
  appTagline: { fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 6 },
  formCard: {
    backgroundColor: "#FFFFFF", borderRadius: 24, padding: 28,
    shadowColor: "rgba(0,0,0,0.25)", shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1, shadowRadius: 32, elevation: 12,
  },
  welcomeTitle: { fontSize: 24, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  welcomeSubtitle: { fontSize: 14, color: Colors.dark.textMuted, marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: "600", color: Colors.primary, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.08)", borderRadius: 12,
    padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "rgba(239,68,68,0.2)",
  },
  errorText: { color: Colors.error, fontSize: 14, fontWeight: "500", textAlign: "center" },
  inputGroup: { gap: 14 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f8fafc", borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border, overflow: "hidden",
  },
  inputIcon: { paddingLeft: 16, paddingRight: 4 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 10, fontSize: 15, color: Colors.text },
  eyeButton: { paddingHorizontal: 16, paddingVertical: 16 },
  pickerWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f8fafc", borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border, overflow: "hidden",
  },
  picker: { flex: 1, color: Colors.text },
  loginButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: "center", justifyContent: "center",
    marginTop: 24, shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3,
    shadowRadius: 12, elevation: 6,
  },
  loginButtonDisabled: { backgroundColor: Colors.textLight, shadowOpacity: 0, elevation: 0 },
  loginButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  backLink: { marginTop: 16, alignItems: "center" },
  backLinkText: { fontSize: 14, color: Colors.dark.textMuted },
  backLinkBold: { color: Colors.primary, fontWeight: "700" },
  footerText: { marginTop: 20, textAlign: "center", fontSize: 11, color: Colors.dark.textMuted },
});
