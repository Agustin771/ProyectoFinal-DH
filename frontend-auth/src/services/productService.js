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

export async function getAllProducts() {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener los productos")
        );
    }

    return data;
}

export async function getPaginatedProducts(page = 0, size = 10) {
    const response = await fetch(`${API_URL}/paginated?page=${page}&size=${size}`, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener los productos paginados")
        );
    }

    return data;
}

export async function getRandomProducts() {
    const response = await fetch(`${API_URL}/random`, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener los productos aleatorios")
        );
    }

    return data;
}

export async function getProductById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al obtener el producto")
        );
    }

    return data;
}

export async function createProduct(productData, apiFetch) {

    const response = await apiFetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });

    const data = await readResponse(response);

    if (!response.ok) {
        const error = new Error(
            getErrorMessage(data, 'Error al crear el producto')
        );

        error.data = data;
        throw error;
    }

    return data;
}

export async function updateProduct(id, productData, apiFetch) {

    const response = await apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, 'Error al actualizar el producto')
        );
    }

    return data;
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al eliminar el producto")
        );
    }

    return data;
}

export async function searchProducts(keyword, startDate, endDate) {
    const params = new URLSearchParams({
        startDate,
        endDate
    });

    if (keyword?.trim()) {
        params.append("keyword", keyword.trim());
    }

    const response = await fetch(
        `${API_URL}/search?${params.toString()}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, "Error al buscar productos")
        );
    }

    return data;
}

export async function getProductAvailability(
    productId,
    startDate,
    endDate
) {
    const params = new URLSearchParams({
        startDate,
        endDate
    });

    const response = await fetch(
        `${API_URL}/${productId}/availability?${params.toString()}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                "No se pudo obtener la disponibilidad"
            )
        );
    }

    return data;
}