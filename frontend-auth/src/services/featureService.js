const API_URL = "/api/features";

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

export async function getAllFeatures(apiFetch) {

    const response = await apiFetch(API_URL, {
        method: "GET"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al cargar las características")
        );
    }

    return data;
}
