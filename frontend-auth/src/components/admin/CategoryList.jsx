
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getAllCategories,
    deleteCategory
} from '../../services/categoryService';

export default function CategoryList() {

    const { apiFetch } = useAuth();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const loadCategories = async () => {
        try {
            setError('');

            const data = await getAllCategories();

            setCategories(Array.isArray(data) ? data : []);

        } catch (err) {
            setError(err.message || 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);


    const handleDelete = async (category) => {

        const confirmDelete = window.confirm(
            `¿Seguro que querés eliminar la categoría "${category.title}"?`
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(category.id);
            setError('');
            setSuccess('');

            await deleteCategory(category.id, apiFetch);

            setSuccess('¡Categoría eliminada correctamente!');

            await loadCategories();

        } catch (err) {

    if (err.status === 409) {

        setError(
            `No podés eliminar "${category.title}" porque tiene productos asociados. Primero cambiá la categoría de esos productos.`
        );

    } else {

        setError(
            'Ocurrió un error al eliminar la categoría. Intentá nuevamente.'
        );

    }
    } finally {
        setDeletingId(null);
    }};
    return (
        <section className="admin-form-card">

            <h3>Categorías existentes</h3>

            {error && (
                <div className="admin-message error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-message success-message">
                    {success}
                </div>
            )}
            {loading ? (
                <p>Cargando categorías...</p>
            ) : categories.length === 0 ? (
                <p>No hay categorías creadas.</p>
            ) : (
                <div className="category-admin-list">
                    {categories.map(category => (
                        <div
                            className="category-admin-item"
                            key={category.id}
                        >
                            <div>
                                <strong>{category.title}</strong>
                                <p>{category.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                disabled={deletingId !== null}
                                className="category-delete-button"
                            >
                                {deletingId === category.id
                                    ? 'Eliminando...'
                                    : '🗑️ Eliminar'}
                            </button>
                        </div>
                    ))}

                </div>
            )}

        </section>
    );
}
