const API_URL = "http://localhost:8080/api/categories";

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
export async function getAllCategories() {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener las categorías")
        );
    }

    return data;
}
export async function createCategory(categoryData, apiFetch) {

    const response = await apiFetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
    });

    const data = await readResponse(response);

    if (!response.ok) {
        const error = new Error(
            getErrorMessage(data, 'Error al crear la categoría')
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}

export async function deleteCategory(id, apiFetch) {

    const response = await apiFetch(`/api/categories/${id}`, {
        method: 'DELETE'
    });

    const data = await readResponse(response);

    if (!response.ok) {
        const error = new Error(
            getErrorMessage(data, 'Error al eliminar la categoría')
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}
