import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../services/categoryService';
import '../../styles/categories.css';

export default function Categories({ onCategorySelect, selectedCategory }) {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'No se pudieron cargar las categorías');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="categories-section">

            <div className="categories-header">
                <span>ENCONTRÁ TU ESTADÍA IDEAL</span>

                <h2>Buscar por tipo de alojamiento</h2>

                <p>
                    Elegí el alojamiento que mejor se adapte a tu viaje.
                </p>
            </div>

            {loading && (
                <p className="categories-status">
                    Cargando categorías...
                </p>
            )}

            {error && (
                <p className="categories-error">{error}</p>
            )}

            {!loading && !error && (
                <>
                    <div className="categories-container">

                        {categories.map((category) => (
                            <article
                                className={`category-card ${
                                    selectedCategory === category.id
                                        ? 'selected'
                                        : ''
                                }`}
                                key={category.id}
                                onClick={() => onCategorySelect?.(category)}
                            >

                                <div className="category-image">
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt={category.title}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <span>🏨</span>
                                    )}
                                </div>

                                <div className="category-content">
                                    <h3>{category.title}</h3>

                                    <p>{category.description}</p>

                                    <span className="category-arrow">
                                        Ver alojamientos →
                                    </span>
                                </div>

                            </article>
                        ))}

                    </div>

                    {categories.length === 0 && (
                        <p className="categories-status">
                            Todavía no hay categorías disponibles.
                        </p>
                    )}
                </>
            )}
        </section>
    );
}
