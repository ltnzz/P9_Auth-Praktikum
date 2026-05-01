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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert("Email kosong", "Masukkan email akun Anda.");
            return;
        }

        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email.trim());
            Alert.alert("Sukses", "Email reset password telah dikirim.");
        } catch (e) {
            Alert.alert("Gagal", e.message);
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
                <Text style={styles.badge}>Bantuan Login</Text>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.caption}>
                    Masukkan email akun Anda, lalu cek inbox untuk link reset.
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

                <Pressable
                    style={[
                        styles.primaryButton,
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={handleReset}
                    disabled={loading}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? "Mengirim..." : "Kirim reset password"}
                    </Text>
                </Pressable>

                <Text style={styles.link} onPress={() => navigation.goBack()}>
                    Kembali ke login
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
        backgroundColor: "#fef3c7",
        color: "#92400e",
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
        backgroundColor: "#f59e0b",
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
        color: "#92400e",
        fontWeight: "700",
        marginTop: 18,
        textAlign: "center",
    },
});
