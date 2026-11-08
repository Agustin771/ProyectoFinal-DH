import React, { useState, useEffect } from "react";
import {
    useNavigate,
    useOutletContext,
    useSearchParams
} from "react-router-dom";

import { useAuth } from "../components/context/AuthContext";

import SearchBar from "../components/home/SearchBar";
import Categories from "../components/home/Categories";
import Recommendations from "../components/home/Recommendations";

export default function Home() {

    const navigate = useNavigate();

    const { isAdmin, apiFetch } = useAuth();

    const { onProductSelect } = useOutletContext();

    const [searchParams] = useSearchParams();

    const [searchResults, setSearchResults] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {

        const productId = searchParams.get("product");

        if (!productId) return;

        let active = true;

        async function loadSharedProduct() {

            try {

                const response = await apiFetch("/api/products");

                if (!response.ok) {
                    throw new Error(
                        "No se pudo obtener el producto compartido"
                    );
                }

                const products = await response.json();

                const product = products.find(
                    item => String(item.id) === productId
                );

                if (active && product) {
                    onProductSelect(product);
                }

                if (active && !product) {
                    console.error("El producto compartido no existe.");
                }

            } catch (error) {

                console.error(
                    "Error al cargar el producto compartido:",
                    error
                );

            }

        }

        loadSharedProduct();

        return () => {
            active = false;
        };

    }, [searchParams, apiFetch, onProductSelect]);

    return (

        <main className="home">

            <div className="home-container">

                {isAdmin && (
                    <div className="home-admin-actions">

                        <button
                            type="button"
                            className="home-admin-button"
                            onClick={() => navigate("/admin")}
                        >
                            <span>⚙️</span>
                            Panel de Administración
                        </button>

                    </div>
                )}

                <SearchBar
                    onSearchResults={setSearchResults}
                />

                {searchResults !== null ? (

                    <section className="search-results">

                        <h2>Resultados de búsqueda</h2>

                        {searchResults.length === 0 ? (

                            <p>
                                No encontramos productos disponibles
                                para esas fechas.
                            </p>

                        ) : (

                            <div className="search-results-grid">

                                {searchResults.map(product => (

                                    <article
                                        key={product.id}
                                        className="search-result-card"
                                    >

                                        {product.images?.length > 0 && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                            />
                                        )}

                                        <h3>{product.name}</h3>

                                        <p>{product.description}</p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onProductSelect(product)
                                            }
                                        >
                                            Ver producto
                                        </button>

                                    </article>

                                ))}

                            </div>

                        )}

                        <button
                            type="button"
                            onClick={() => setSearchResults(null)}
                        >
                            Limpiar búsqueda
                        </button>

                    </section>

                ) : (

                    <>

                        <Categories
                            selectedCategory={selectedCategory}
                            onCategorySelect={(category) =>
                                setSelectedCategory(category.id)
                            }
                        />

                        <Recommendations
                            selectedCategory={selectedCategory}
                            onClearCategory={() =>
                                setSelectedCategory(null)
                            }
                            onProductSelect={onProductSelect}
                        />

                    </>

                )}
            </div>
        </main>
    );
}
