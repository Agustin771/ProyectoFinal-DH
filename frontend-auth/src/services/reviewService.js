const API_URL = "http://localhost:8080/api/products";

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

export async function getProductReviews(productId) {
    const response = await fetch(`${API_URL}/${productId}/reviews`, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener las reseñas")
        );
    }

    return data;
}

export async function getRatingSummary(productId) {
    const response = await fetch(`${API_URL}/${productId}/reviews/summary`, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener el resumen de puntuación")
        );
    }

    return data;
}

export async function createReview(productId, reviewData, apiFetch) {
    const response = await apiFetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
    });

    const data = await readResponse(response);

    if (!response.ok) {
        const error = new Error(
            getErrorMessage(data, "Error al crear la reseña")
        );
        error.data = data;
        throw error;
    }

    return data;
}