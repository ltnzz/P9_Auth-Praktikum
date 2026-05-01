import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { AppState } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { auth } from "../config/firebase";

const AuthContext = createContext();
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logoutTimer = useRef(null);

    const clearLogoutTimer = () => {
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    const logout = async () => {
        clearLogoutTimer();
        await signOut(auth);
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("is_logged_in");
    };

    const resetIdleTimer = () => {
        clearLogoutTimer();
        if (!auth.currentUser) return;

        logoutTimer.current = setTimeout(() => {
            logout();
        }, IDLE_TIMEOUT_MS);
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);

            if (u) {
                const token = await u.getIdToken();
                await SecureStore.setItemAsync("auth_token", token);
                await SecureStore.setItemAsync("is_logged_in", "true");
                resetIdleTimer();
            } else {
                await SecureStore.deleteItemAsync("auth_token");
                await SecureStore.deleteItemAsync("is_logged_in");
                clearLogoutTimer();
            }
            setLoading(false);
        });

        return () => {
            unsub();
            clearLogoutTimer();
        };
    }, []);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (nextState) => {
            if (nextState === "active") {
                resetIdleTimer();
            }
        });

        return () => sub.remove();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                resetIdleTimer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
