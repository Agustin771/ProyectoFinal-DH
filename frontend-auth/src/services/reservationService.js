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

export async function createReservation(
    productId,
    startDate,
    endDate,
    apiFetch
) {
    const response = await apiFetch("/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId,
            startDate,
            endDate
        })
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudo realizar la reserva")
        );
    }

    return data;
}

export async function getMyReservations(apiFetch) {
    const response = await apiFetch(
        "/api/reservations/my-reservations",
        { method: "GET" }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "No se pudieron obtener tus reservas")
        );
    }

    return data;
}
