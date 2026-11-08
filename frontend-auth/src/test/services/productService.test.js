
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
    getPaginatedProducts,
    getProductById,
    searchProducts,
    getProductAvailability
} from "../../services/productService";

describe("productService", () => {

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("debe obtener los productos paginados", async () => {
        const products = {
            content: [{ id: 1, name: "Hotel" }],
            totalPages: 2
        };

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(products)
        });

        const result = await getPaginatedProducts(0, 10);

        expect(result).toEqual(products);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/products/paginated?page=0&size=10",
            {
                method: "GET",
                credentials: "include"
            }
        );
    });

    it("debe obtener un producto por su ID", async () => {
        const product = { id: 7, name: "Cabaña" };

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(product)
        });

        const result = await getProductById(7);

        expect(result).toEqual(product);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/products/7",
            {
                method: "GET",
                credentials: "include"
            }
        );
    });

    it("debe buscar productos por palabra clave y rango de fechas", async () => {
        const products = [{ id: 2, name: "Hotel en Tigre" }];

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(products)
        });

        const result = await searchProducts(
            "  Tigre  ",
            "2026-12-10",
            "2026-12-15"
        );

        expect(result).toEqual(products);

        const calledUrl = fetch.mock.calls[0][0];

        expect(calledUrl).toContain("/api/products/search?");
        expect(calledUrl).toContain("startDate=2026-12-10");
        expect(calledUrl).toContain("endDate=2026-12-15");
        expect(calledUrl).toContain("keyword=Tigre");
    });

    it("debe consultar la disponibilidad de un producto", async () => {
        const availability = {
            available: true,
            remainingCapacity: 4
        };

        fetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(availability)
        });

        const result = await getProductAvailability(
            7,
            "2026-12-10",
            "2026-12-15"
        );

        expect(result).toEqual(availability);

        const calledUrl = fetch.mock.calls[0][0];

        expect(calledUrl).toContain(
            "http://localhost:8080/api/products/7/availability?"
        );
        expect(calledUrl).toContain("startDate=2026-12-10");
        expect(calledUrl).toContain("endDate=2026-12-15");
    });

});
