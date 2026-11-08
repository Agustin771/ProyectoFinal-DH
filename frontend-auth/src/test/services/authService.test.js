import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { login } from "../../services/authService";

describe("authService - login", () => {

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("debe iniciar sesión correctamente y devolver los datos", async () => {

        const mockResponse = {
            token: "jwt-de-prueba",
            message: "Login exitoso"
        };

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(mockResponse)
        });

        const result = await login("usuario@test.com", "Password123");

        expect(result).toEqual(mockResponse);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: "usuario@test.com",
                    password: "Password123"
                })
            }
        );
    });

    it("debe lanzar un error cuando las credenciales son incorrectas", async () => {

        fetch.mockResolvedValue({
            ok: false,
            text: async () => JSON.stringify({
                message: "Credenciales incorrectas"
            })
        });

        await expect(
            login("usuario@test.com", "claveIncorrecta")
        ).rejects.toThrow("Credenciales incorrectas");
    });

    it("debe utilizar un mensaje genérico si el servidor no devuelve un error", async () => {

        fetch.mockResolvedValue({
            ok: false,
            text: async () => ""
        });

        await expect(
            login("usuario@test.com", "Password123")
        ).rejects.toThrow("Error al iniciar sesión");
    });

});
