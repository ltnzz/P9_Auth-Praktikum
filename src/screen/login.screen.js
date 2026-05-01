import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import * as SecureStore from "expo-secure-store";
import { authenticateBiometric } from "../utils/biometric";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const cleanEmail = email.trim();
            await signInWithEmailAndPassword(auth, cleanEmail, password);
            await SecureStore.setItemAsync("biometric_email", cleanEmail);
            await SecureStore.setItemAsync("biometric_password", password);
        } catch (e) {
            Alert.alert("Login gagal", e.message);
        }
    };

    const handleBiometric = async () => {
        try {
            const savedEmail =
                await SecureStore.getItemAsync("biometric_email");
            const savedPassword =
                await SecureStore.getItemAsync("biometric_password");

            if (!savedEmail || !savedPassword) {
                Alert.alert(
                    "Biometric belum aktif",
                    "Login dulu pakai email dan password, setelah itu biometric bisa dipakai."
                );
                return;
            }

            const biometricAuth = await authenticateBiometric();

            if (!biometricAuth.success) {
                Alert.alert("Gagal", biometricAuth.error);
                return;
            }

            await signInWithEmailAndPassword(auth, savedEmail, savedPassword);
        } catch (e) {
            Alert.alert("Biometric gagal", e.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.brand}>Auth Praktikum</Text>
                <Text style={styles.title}>Masuk ke akun</Text>
                <Text style={styles.caption}>
                    Gunakan email dan password yang sudah terdaftar.
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="nama@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9ca3af"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Masukkan password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                />

                <Pressable style={styles.primaryButton} onPress={handleLogin}>
                    <Text style={styles.primaryButtonText}>Login</Text>
                </Pressable>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={handleBiometric}
                >
                    <Text style={styles.secondaryButtonText}>
                        Login dengan biometric
                    </Text>
                </Pressable>

                <Text
                    style={styles.forgotLink}
                    onPress={() => navigation.navigate("ForgotPassword")}
                >
                    Lupa password?
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Belum punya akun?</Text>
                <Text
                    style={styles.footerLink}
                    onPress={() => navigation.navigate("Register")}
                >
                    Daftar sekarang
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f8fafc",
    },
    card: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 16,
        padding: 24,
        backgroundColor: "#ffffff",
        shadowColor: "#111827",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 4,
    },
    brand: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 18,
        overflow: "hidden",
        backgroundColor: "#dcfce7",
        color: "#166534",
        fontSize: 12,
        fontWeight: "700",
    },
    title: {
        color: "#111827",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 8,
    },
    caption: {
        color: "#6b7280",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    label: {
        color: "#374151",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
        backgroundColor: "#f9fafb",
        color: "#111827",
        fontSize: 15,
    },
    primaryButton: {
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 4,
        backgroundColor: "#16a34a",
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "800",
    },
    secondaryButton: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#bbf7d0",
        borderRadius: 12,
        paddingVertical: 13,
        marginTop: 12,
        backgroundColor: "#f0fdf4",
    },
    secondaryButtonText: {
        color: "#166534",
        fontSize: 15,
        fontWeight: "700",
    },
    forgotLink: {
        color: "#2563eb",
        fontWeight: "700",
        marginTop: 18,
        textAlign: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        marginTop: 22,
    },
    footerText: {
        color: "#6b7280",
    },
    footerLink: {
        color: "#16a34a",
        fontWeight: "800",
    },
});
