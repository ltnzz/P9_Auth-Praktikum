import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/auth.context";
import LoginScreen from "./src/screen/login.screen";
import RegisterScreen from "./src/screen/register.screen";
import ForgotPasswordScreen from "./src/screen/forgot.password";
import HomeScreen from "./src/screen/home.screen";
import * as LocalAuthentication from "expo-local-authentication";

const Stack = createNativeStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#f8fafc" },
                headerShadowVisible: false,
                headerTitleStyle: { color: "#111827", fontWeight: "700" },
                contentStyle: { backgroundColor: "#f8fafc" },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Masuk" }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Daftar" }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: "Reset Password" }}
            />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#f8fafc" },
                headerShadowVisible: false,
                headerTitleStyle: { color: "#111827", fontWeight: "700" },
                contentStyle: { backgroundColor: "#f8fafc" },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}

function Root() {
    const { user, loading, resetIdleTimer } = useAuth();
    if (loading) return null;
    return (
        <View style={{ flex: 1 }} onTouchStart={resetIdleTimer}>
            <NavigationContainer>
                {user ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </View>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Root />
        </AuthProvider>
    );
}
