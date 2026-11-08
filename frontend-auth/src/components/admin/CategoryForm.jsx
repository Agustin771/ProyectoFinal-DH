import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCategory } from '../../services/categoryService';

export default function CategoryForm({ onCategoryCreated }) {

    const { apiFetch } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const isValidImageUrl = (url) => {

        if (!url.trim()) return true;

        try {
            const parsedUrl = new URL(url);

            return (
                parsedUrl.protocol === 'http:' ||
                parsedUrl.protocol === 'https:'
            );
        } catch {
            return false;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!isValidImageUrl(formData.imageUrl)) {
        setError(
            'La URL de la imagen no es válida. Ingresá una dirección que comience con https:// o http://'
        );
        return;
    }

    setLoading(true);

    try {
        await createCategory(formData, apiFetch);

        setSuccess('¡Categoría creada correctamente!');

        setFormData({
            title: '',
            description: '',
            imageUrl: ''
        });

        if (onCategoryCreated) {
            onCategoryCreated();
        }

    } catch (err) {

        if (err.status === 400 || err.status === 422) {
            setError(
                'No se pudo crear la categoría. Revisá los datos ingresados y la URL de la imagen.'
            );

        } else {
            setError(
                'Ocurrió un error al crear la categoría. Intentá nuevamente.'
            );
        }

    } finally {
        setLoading(false);
    }
    };

    return (
        <section className="admin-form-card">

            <form onSubmit={handleSubmit}>

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

                <div className="admin-form-group">
                    <label htmlFor="category-title">
                        Nombre de la categoría
                    </label>

                    <input
                        id="category-title"
                        type="text"
                        name="title"
                        placeholder="Ej: Hoteles"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="admin-form-group">
                    <label htmlFor="category-description">
                        Descripción
                    </label>

                    <textarea
                        id="category-description"
                        name="description"
                        placeholder="Describí esta categoría..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>

                <div className="admin-form-group">
                    <label htmlFor="category-image">
                        URL de la imagen
                    </label>
                <input
                    id="category-image"
                    type="url"
                    name="imageUrl"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    onInvalid={(e) => {
                        e.target.setCustomValidity(
                            'Ingresá una URL válida para la imagen.'
                        );
                    }}
                    onInput={(e) => e.target.setCustomValidity('')}
                />
                </div>

                <button
                    type="submit"
                    className="admin-submit-button"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : '+ Crear categoría'}
                </button>

            </form>
        </section>
    );
}
