import { describe, it, expect, vi, beforeEach } from "vitest";

import {
    createReservation,
    getMyReservations
} from "../../services/reservationService";

describe("reservationService", () => {

    let apiFetch;

    beforeEach(() => {
        apiFetch = vi.fn();
    });

    it("debe enviar correctamente los datos para crear una reserva", async () => {
        const reservation = {
            id: 10,
            productId: 3,
            startDate: "2026-12-10",
            endDate: "2026-12-15"
        };

        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(reservation)
        });

        const result = await createReservation(
            3,
            "2026-12-10",
            "2026-12-15",
            apiFetch
        );

        expect(result).toEqual(reservation);

        expect(apiFetch).toHaveBeenCalledWith(
            "/api/reservations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: 3,
                    startDate: "2026-12-10",
                    endDate: "2026-12-15"
                })
            }
        );
    });

    it("debe obtener las reservas del usuario autenticado", async () => {
        const reservations = [
            { id: 1, productName: "Hotel" },
            { id: 2, productName: "Cabaña" }
        ];

        apiFetch.mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify(reservations)
        });

        const result = await getMyReservations(apiFetch);

        expect(result).toEqual(reservations);

        expect(apiFetch).toHaveBeenCalledWith(
            "/api/reservations/my-reservations",
            { method: "GET" }
        );
    });

    it("debe mostrar el error devuelto por el backend al reservar", async () => {
        apiFetch.mockResolvedValue({
            ok: false,
            text: async () => JSON.stringify({
                message: "El producto no está disponible"
            })
        });

        await expect(
            createReservation(
                3,
                "2026-12-10",
                "2026-12-15",
                apiFetch
            )
        ).rejects.toThrow("El producto no está disponible");
    });

});
