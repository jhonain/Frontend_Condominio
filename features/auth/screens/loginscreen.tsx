// features/auth/screens/LoginScreen.tsx
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Building2, Eye, EyeOff, Lock, User } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthViewModel } from "../viewmodels/useAuthViewModel";
import { useGoogleAuthViewModel } from "../viewmodels/useGoogleAuthViewModel";
import { goToRegisterPersonaUser } from "@/navigation/routes";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { username, setUsername, password, setPassword, loading, error, onLogin } =
    useAuthViewModel();
  const { onGoogleLogin, loadingGoogle, errorGoogle } = useGoogleAuthViewModel();

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

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Animated.View
            style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}
          >
            <View style={styles.logoContainer}>
              <Building2 size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>MiCondominio</Text>
            <Text style={styles.appTagline}>Tu comunidad, en tu mano</Text>
          </Animated.View>

          {/* Card del formulario */}
          <Animated.View
            style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <Text style={styles.welcomeSubtitle}>Ingresa tus credenciales para continuar</Text>

            {/* Error */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Inputs */}
            <View style={styles.inputGroup}>

              {/* Usuario */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <User size={18} color={Colors.dark.textMuted} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor={Colors.dark.textLight}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Contraseña */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Lock size={18} color={Colors.dark.textMuted} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor={Colors.dark.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={Colors.dark.textMuted} />
                  ) : (
                    <Eye size={18} color={Colors.dark.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón login */}
            <TouchableOpacity
              style={[styles.loginButton, (!isFormValid || loading) && styles.loginButtonDisabled]}
              onPress={onLogin}
              disabled={!isFormValid || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.loginButtonContent}>
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botón Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={onGoogleLogin}
              disabled={loadingGoogle || loading}
              activeOpacity={0.85}
            >
              {loadingGoogle ? (
                <ActivityIndicator color="#444" size="small" />
              ) : (
                <View style={styles.googleButtonContent}>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </View>
              )}
            </TouchableOpacity>


            {/* Botón ir a registro */}
            <TouchableOpacity onPress={() => goToRegisterPersonaUser()} style={styles.registerLink}>
              <Text style={styles.registerLinkText}>
                ¿No tienes cuenta? <Text style={styles.registerLinkBold}>Regístrate</Text>
              </Text>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: "center" },
  logoSection: { alignItems: "center", marginBottom: 40 },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  appName: { fontSize: 30, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5 },
  appTagline: { fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 6 },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  welcomeTitle: { fontSize: 24, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  welcomeSubtitle: { fontSize: 14, color: Colors.dark.textMuted, marginBottom: 24 },
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  errorText: { color: Colors.error, fontSize: 14, fontWeight: "500", textAlign: "center" },
  inputGroup: { gap: 14 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  inputIcon: { paddingLeft: 16, paddingRight: 4 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 10, fontSize: 15, color: Colors.text },
  eyeButton: { paddingHorizontal: 16, paddingVertical: 16 },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: { backgroundColor: Colors.textLight, shadowOpacity: 0, elevation: 0 },
  loginButtonContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  loginButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  footerText: { marginTop: 20, textAlign: "center", fontSize: 11, color: Colors.dark.textMuted },
  registerLink: { marginTop: 16, alignItems: "center" },
  registerLinkText: { fontSize: 14, color: Colors.dark.textMuted },
  registerLinkBold: { color: Colors.primary, fontWeight: "700" },


  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.dark.textMuted },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: "#FAFAFA",
  },
  googleButtonContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  googleIcon: { fontSize: 18, fontWeight: "800", color: "#4285F4" },
  googleButtonText: { fontSize: 15, fontWeight: "600", color: Colors.text },

});
