const API_URL = "http://localhost:8080/auth";

async function readResponse(response) {
    const text = await response.text();

    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(data, fallback) {
    if (typeof data === "string") return data || fallback;
    return data?.message || fallback;
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al iniciar sesión")
        );
    }

    return data;
}

export async function refresh() {
    const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudo renovar la sesión")
        );
    }

    return data;
}

export async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al cerrar sesión")
        );
    }

    return data;
}

export async function register(name, lastName, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            name,
            lastName,
            email,
            password
        })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        const error = new Error(
            data.message || "Error al registrarse"
        );

        error.data = data;

        throw error;
    }

    return data;
}

export async function verifyAccount(email, code) {
    const response = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, code })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al verificar la cuenta")
        );
    }

    return data;
}

export async function resendVerification(email) {
    const response = await fetch(`${API_URL}/resend-verification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudo reenviar el código")
        );
    }

    return data;
}

export async function forgotPassword(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudo solicitar la recuperación")
        );
    }

    return data;
}

export async function resetPassword(email, token, newPassword) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            token,
            newPassword
        })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudo restablecer la contraseña")
        );
    }

    return data;
}