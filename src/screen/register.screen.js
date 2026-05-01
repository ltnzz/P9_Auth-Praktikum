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
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "../config/firebase";

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Data belum lengkap", "Isi email dan password dulu.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password tidak cocok", "Ulangi konfirmasi password.");
            return;
        }

        try {
            setLoading(true);
            const cred = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );
            await sendEmailVerification(cred.user);
            await auth.currentUser.reload();
            Alert.alert("Sukses", "Cek email Anda untuk verifikasi.");
        } catch (e) {
            Alert.alert("Register gagal", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.badge}>Akun Baru</Text>
                <Text style={styles.title}>Daftar Akun</Text>
                <Text style={styles.caption}>
                    Buat akun untuk mulai memakai aplikasi.
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
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                />

                <Text style={styles.label}>Konfirmasi Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                />

                <Pressable
                    style={[
                        styles.primaryButton,
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? "Mendaftarkan..." : "Register"}
                    </Text>
                </Pressable>

                <Text style={styles.link} onPress={() => navigation.goBack()}>
                    Sudah punya akun? Login
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
    badge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 18,
        overflow: "hidden",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
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
        backgroundColor: "#2563eb",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "800",
    },
    link: {
        color: "#2563eb",
        fontWeight: "700",
        marginTop: 18,
        textAlign: "center",
    },
});
