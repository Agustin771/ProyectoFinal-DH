import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback
} from "react";

import {
    login as loginRequest,
    refresh as refreshRequest,
    logout as logoutRequest
} from "../../services/authService";

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:8080";

export function AuthProvider({ children }) {

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const initialized = useRef(false);
    const tokenRef = useRef(null);
    const refreshPromiseRef = useRef(null);

    const updateToken = useCallback((newToken) => {
        tokenRef.current = newToken;
        setToken(newToken);
    }, []);

    const renewAccessToken = useCallback(async () => {

        if (!refreshPromiseRef.current) {

            refreshPromiseRef.current = refreshRequest()
                .then(data => {
                    updateToken(data.token);
                    return data.token;
                })
                .catch(error => {
                    updateToken(null);
                    throw error;
                })
                .finally(() => {
                    refreshPromiseRef.current = null;
                });
        }

        return refreshPromiseRef.current;

    }, [updateToken]);

    const apiFetch = useCallback(async (path, options = {}) => {

        async function makeRequest(accessToken) {

            const headers = new Headers(options.headers || {});

            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }

            return fetch(`${API_BASE_URL}${path}`, {
                ...options,
                headers,
                credentials: "include"
            });
        }

        let response = await makeRequest(tokenRef.current);

        if (response.status !== 401 && response.status !== 403) {
            return response;
        }

        try {

            const newToken = await renewAccessToken();

            response = await makeRequest(newToken);

            if (response.status === 401) {
                updateToken(null);
            }

            return response;

        } catch (error) {
            return response;
        }

    }, [renewAccessToken, updateToken]);

    const fetchCurrentUser = useCallback(async () => {

        const response = await apiFetch("/auth/me");

        if (!response.ok) {
            throw new Error("No se pudo obtener el usuario");
        }

        const data = await response.json();

        setUser(data);

        return data;

    }, [apiFetch]);

    useEffect(() => {

        if (initialized.current) return;

        initialized.current = true;

        async function checkSession() {

            try {
                await renewAccessToken();
                await fetchCurrentUser();

            } catch (error) {
                updateToken(null);
                setUser(null);

            } finally {
                setLoading(false);
            }
        }

        checkSession();

    }, [renewAccessToken, updateToken, fetchCurrentUser]);

    async function login(email, password) {

        const data = await loginRequest(email, password);

        updateToken(data.token);

        await fetchCurrentUser();
    }

    async function logout() {

        try {
            await logoutRequest();

        } catch (error) {
            console.warn(
                "Sesión ya expirada o inválida en el servidor, limpiando cliente."
            );

        } finally {
            updateToken(null);
            setUser(null);
        }
    }

    const roles = getRolesFromToken(token);

    const isAdmin = roles.some(role =>
        role === "ADMIN" || role === "ROLE_ADMIN"
    );

    const value = {
        token,
        user,
        isAuthenticated: Boolean(token),
        isAdmin,
        roles,
        loading,
        login,
        logout,
        apiFetch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function getRolesFromToken(token) {

    if (!token) return [];

    try {

        const payload = token.split(".")[1];

        const normalized = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const decoded = JSON.parse(atob(normalized));

        const rawRoles =
            decoded.roles ??
            decoded.authorities ??
            decoded.authority ??
            decoded.role ??
            decoded.realm_access?.roles ??
            [];

        const roles = Array.isArray(rawRoles)
            ? rawRoles
            : typeof rawRoles === "string"
                ? rawRoles.split(/[ ,]+/)
                : [];

        return roles
            .map(role =>
                typeof role === "string"
                    ? role
                    : role?.authority
            )
            .filter(Boolean)
            .map(role => role.toUpperCase());

    } catch (error) {

        console.error(
            "No se pudieron obtener los roles del JWT"
        );

        return [];
    }
}

export function useAuth() {
    return useContext(AuthContext);
}