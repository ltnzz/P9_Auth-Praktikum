import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../context/auth.context";

export default function HomeScreen() {
    const { user, logout } = useAuth();

    const handleResendVerification = async () => {
        try {
            if (!user) return;

            await user.reload();
            if (user.emailVerified) {
                Alert.alert(
                    "Sudah verified",
                    "Email akun Anda sudah terverifikasi."
                );
                return;
            }

            await sendEmailVerification(user);
            Alert.alert(
                "Email dikirim",
                "Cek inbox atau folder spam untuk link verifikasi."
            );
        } catch (e) {
            Alert.alert("Gagal mengirim verifikasi", e.message);
        }
    };

    const handleRefreshStatus = async () => {
        try {
            if (!user) return;
            await user.reload();
            Alert.alert(
                "Status diperbarui",
                user.emailVerified
                    ? "Email Anda sudah terverifikasi."
                    : "Email masih belum terverifikasi."
            );
        } catch (e) {
            Alert.alert("Gagal refresh status", e.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.badge}>Berhasil Login</Text>
                <Text style={styles.title}>Selamat datang!</Text>
                <Text style={styles.subtitle}>
                    Anda sudah masuk ke aplikasi Auth Praktikum.
                </Text>
            </View>

            <View style={styles.profileCard}>
                <Text style={styles.label}>Email aktif</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.label}>Status verifikasi</Text>
                <Text style={styles.status}>
                    {user?.emailVerified
                        ? "Terverifikasi"
                        : "Belum terverifikasi"}
                </Text>

                {!user?.emailVerified && (
                    <View style={styles.verificationActions}>
                        <Pressable
                            style={styles.verifyButton}
                            onPress={handleResendVerification}
                        >
                            <Text style={styles.verifyButtonText}>
                                Kirim ulang verifikasi
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.refreshButton}
                            onPress={handleRefreshStatus}
                        >
                            <Text style={styles.refreshButtonText}>
                                Refresh status
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>

            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 24,
        backgroundColor: "#f8fafc",
    },
    hero: {
        borderRadius: 18,
        padding: 24,
        marginTop: 16,
        backgroundColor: "#14532d",
    },
    badge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 22,
        overflow: "hidden",
        backgroundColor: "#dcfce7",
        color: "#166534",
        fontSize: 12,
        fontWeight: "800",
    },
    title: {
        color: "#ffffff",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 10,
    },
    subtitle: {
        color: "#bbf7d0",
        fontSize: 16,
        lineHeight: 23,
    },
    profileCard: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 16,
        padding: 20,
        backgroundColor: "#ffffff",
        shadowColor: "#111827",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 4,
    },
    label: {
        color: "#6b7280",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 6,
    },
    email: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 18,
    },
    status: {
        color: "#16a34a",
        fontSize: 16,
        fontWeight: "800",
    },
    verificationActions: {
        gap: 10,
        marginTop: 18,
    },
    verifyButton: {
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 13,
        backgroundColor: "#2563eb",
    },
    verifyButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
    refreshButton: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#bfdbfe",
        borderRadius: 12,
        paddingVertical: 12,
        backgroundColor: "#eff6ff",
    },
    refreshButtonText: {
        color: "#1d4ed8",
        fontSize: 15,
        fontWeight: "800",
    },
    logoutButton: {
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 14,
        marginBottom: 16,
        backgroundColor: "#dc2626",
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "800",
    },
});
