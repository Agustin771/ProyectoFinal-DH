import { describe, it, expect, vi, beforeEach } from "vitest";

import {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
} from "../../services/favoriteService";

describe("favoriteService", () => {

    let apiFetch;

    beforeEach(() => {
        apiFetch = vi.fn();
    });

    it("debe obtener los favoritos del usuario", async () => {
        const favorites = [{ id: 1, name: "Hotel" }];

        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(favorites)
        });

        const result = await getFavorites(apiFetch);

        expect(result).toEqual(favorites);
        expect(apiFetch).toHaveBeenCalledWith("/api/favorites", {
            method: "GET"
        });
    });

    it("debe agregar un producto a favoritos", async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({ message: "Agregado" })
        });

        const result = await addFavorite(5, apiFetch);

        expect(result).toEqual({ message: "Agregado" });
        expect(apiFetch).toHaveBeenCalledWith("/api/favorites/5", {
            method: "POST"
        });
    });

    it("debe eliminar un producto de favoritos", async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => ""
        });

        const result = await removeFavorite(5, apiFetch);

        expect(result).toBe(true);
        expect(apiFetch).toHaveBeenCalledWith("/api/favorites/5", {
            method: "DELETE"
        });
    });

    it("debe indicar si un producto es favorito", async () => {
        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({ isFavorite: true })
        });

        const result = await checkFavorite(5, apiFetch);

        expect(result).toBe(true);
        expect(apiFetch).toHaveBeenCalledWith(
            "/api/favorites/5/exists",
            { method: "GET" }
        );
    });

    it("debe lanzar un error si falla la consulta de favoritos", async () => {
        apiFetch.mockResolvedValue({
            ok: false,
            text: async () => JSON.stringify({
                message: "No autorizado"
            })
        });

        await expect(
            getFavorites(apiFetch)
        ).rejects.toThrow("No autorizado");
    });

});
