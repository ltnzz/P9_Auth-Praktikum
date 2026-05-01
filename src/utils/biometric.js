import * as LocalAuthentication from "expo-local-authentication";

export const authenticateBiometric = async (promptMessage = "Login dengan biometric") => {
    try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
            return { success: false, error: "Device ini tidak mendukung biometric." };
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
            return { success: false, error: "Aktifkan fingerprint atau face unlock di pengaturan device." };
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage,
            fallbackLabel: "Gunakan password",
            cancelLabel: "Batal",
        });

        if (!result.success) {
            return { success: false, error: "Biometric tidak cocok atau dibatalkan." };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
