import React, { useState, useEffect } from "react";
import "../../styles/recommendations.css";
import FavoriteButton from "../products/FavoriteButton";
import {
    getPaginatedProducts,
    getAllProducts
} from "../../services/productService";

export default function Recommendations({
    selectedCategory,
    onClearCategory,
    onProductSelect
}) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PRODUCTS_PER_PAGE = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    useEffect(() => {
        let active = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let data;

                if (selectedCategory !== null) {
                    // Obtener productos de la categoría
                    const allProducts = await getAllProducts();

                    const filteredProducts = Array.isArray(allProducts)
                        ? allProducts.filter(product =>
                            Number(product.category?.id) ===
                            Number(selectedCategory)
                        )
                        : [];

                    const pages = Math.ceil(
                        filteredProducts.length / PRODUCTS_PER_PAGE
                    );

                    const startIndex =
                        (currentPage - 1) * PRODUCTS_PER_PAGE;

                    data = filteredProducts.slice(
                        startIndex,
                        startIndex + PRODUCTS_PER_PAGE
                    );

                    if (active) {
                        setTotalPages(pages);
                        setProducts(data);
                    }

                } else {
                    const response = await getPaginatedProducts(
                        currentPage - 1,
                        PRODUCTS_PER_PAGE
                    );
                    if (active) {
                        setProducts(response.content || []);
                        setTotalPages(response.totalPages || 0);
                    }
                }

            } catch (err) {
                if (active) {
                    console.error(err);
                    setError(
                        err.message || "No se pudieron cargar los alojamientos"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            active = false;
        };

    }, [selectedCategory, currentPage]);

    return (
        <section className="recommendations-section">

            <div className="recommendations-header">

                <span>DESCUBRÍ TU PRÓXIMO DESTINO</span>

                <h2>
                    {selectedCategory !== null
                        ? "Alojamientos de esta categoría"
                        : "Recomendaciones para vos"}
                </h2>

                <p>
                    {selectedCategory !== null
                        ? "Estos son los alojamientos disponibles en la categoría seleccionada."
                        : "Conocé algunos de nuestros alojamientos."}
                </p>

                {selectedCategory !== null && (
                    <button
                        type="button"
                        onClick={onClearCategory}
                        className="clear-category-button"
                    >
                        ← Ver todas las recomendaciones
                    </button>
                )}

            </div>

            {loading && (
                <p className="recommendations-status">
                    Cargando alojamientos...
                </p>
            )}

            {error && (
                <p className="recommendations-error">
                    {error}
                </p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="recommendations-container">

                    {products.map(product => {

                        const image = Array.isArray(product.images)
                            ? product.images[0]
                            : null;

                        return (
                            <article
                                className="recommendation-card"
                                key={product.id}
                                onClick={() => onProductSelect?.(product)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" ||
                                        e.key === " "
                                    ) {
                                        e.preventDefault();
                                        onProductSelect?.(product);
                                    }
                                }}
                            >
                            <div className="recommendation-image">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="recommendation-no-image">
                                        🏨
                                    </div>
                                )}
                                <FavoriteButton productId={product.id} />
                            </div>
                                <div className="recommendation-content">

                                    <h3>{product.name}</h3>

                                    <p>{product.description}</p>

                                    {Array.isArray(product.features) &&
                                        product.features.length > 0 && (

                                        <div className="recommendation-features">

                                            {product.features.map(feature => (

                                                <span
                                                    key={feature.id}
                                                    className="recommendation-feature"
                                                >
                                                    <span>{feature.icon}</span>
                                                    {feature.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {product.category?.title && (
                                        <span className="recommendation-category">
                                            {product.category.title}
                                        </span>
                                    )}
                                </div>
                            </article>
                        );
                    })}

                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="recommendations-status">
                    {selectedCategory !== null
                        ? "Todavía no hay alojamientos en esta categoría."
                        : "Todavía no hay alojamientos disponibles."}
                </p>
            )}


            {!loading && !error && totalPages > 1 && (

                <div className="pagination">

                    <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        Inicio
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                    >
                        ← Anterior
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map(page => (

                        <button
                            type="button"
                            key={page}
                            className={
                                currentPage === page ? "active" : ""
                            }
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>

                    ))}

                    <button
                        type="button"
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente →
                    </button>

                </div>

            )}

        </section>
    );
}
