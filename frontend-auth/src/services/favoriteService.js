const API_URL = "/api/favorites";

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

export async function getFavorites(apiFetch) {

    const response = await apiFetch(API_URL, {
        method: "GET"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener favoritos")
        );
    }

    return data;
}

export async function addFavorite(productId, apiFetch) {

    const response = await apiFetch(
        `${API_URL}/${productId}`,
        {
            method: "POST"
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al agregar favorito")
        );
    }

    return data;
}

export async function removeFavorite(productId, apiFetch) {

    const response = await apiFetch(
        `${API_URL}/${productId}`,
        {
            method: "DELETE"
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al eliminar favorito")
        );
    }

    return true;
}

export async function checkFavorite(productId, apiFetch) {

    const response = await apiFetch(
        `${API_URL}/${productId}/exists`,
        {
            method: "GET"
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al consultar favorito")
        );
    }

    return data.isFavorite;
}