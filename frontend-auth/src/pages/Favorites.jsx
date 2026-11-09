import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../components/context/AuthContext";
import { useFavorites } from "../components/context/FavoritesContext";
import "../styles/responsive.css";
import FavoriteButton from "../components/products/FavoriteButton";
import ProductDetailModal from "../components/products/ProductDetailModal";

import "../styles/favorites.css";

export default function Favorites() {

    const { isAuthenticated } = useAuth();

    const {
        favorites,
        loadingFavorites,
        favoritesError
    } = useFavorites();

    const [selectedProduct, setSelectedProduct] = useState(null);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    function handleProductSelect(product) {
        setSelectedProduct(product);
    }

    function handleCloseModal() {
        setSelectedProduct(null);
    }

    return (
        <>
            <main className="favorites-page">

                <div className="page-back-wrapper">
                    <Link to="/" className="my-reservations-back">
                        <span aria-hidden="true">←</span>
                        Volver a la tienda
                    </Link>
                </div>

                <section className="favorites-header">

                    <h1>
                        Mis favoritos <span>♥</span>
                    </h1>

                    <p>
                        Guardá tus alojamientos preferidos y encontralos
                        fácilmente cuando quieras.
                    </p>

                    {!loadingFavorites && (
                        <span className="favorites-count">
                            {favorites.length}{" "}
                            {favorites.length === 1
                                ? "alojamiento guardado"
                                : "alojamientos guardados"}
                        </span>
                    )}

                </section>

                {loadingFavorites && (
                    <p className="favorites-status">
                        Cargando tus favoritos...
                    </p>
                )}

                {favoritesError && (
                    <p className="favorites-error" role="alert">
                        {favoritesError}
                    </p>
                )}

                {!loadingFavorites &&
                    !favoritesError &&
                    favorites.length === 0 && (

                    <div className="favorites-empty">

                        <span className="favorites-empty-icon">
                            ♡
                        </span>

                        <h2>Todavía no tenés favoritos</h2>

                        <p>
                            Explorá nuestros alojamientos y guardá
                            los que más te gusten.
                        </p>

                        <Link
                            to="/"
                            className="favorites-explore-button"
                        >
                            Explorar alojamientos
                        </Link>

                    </div>
                )}

                {!loadingFavorites &&
                    !favoritesError &&
                    favorites.length > 0 && (

                    <section className="favorites-grid">

                        {favorites.map(favorite => {

                            const product = favorite.product;

                            if (!product) return null;

                            const image = Array.isArray(product.images)
                                ? product.images[0]
                                : null;

                            return (
                                <article
                                    className="favorites-card"
                                    key={favorite.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        handleProductSelect(product)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            handleProductSelect(product);
                                        }
                                    }}
                                >

                                    <div className="favorites-card-image">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="favorites-no-image">
                                                🏨
                                            </div>
                                        )}

                                        <FavoriteButton
                                            productId={product.id}
                                        />

                                    </div>

                                    <div className="favorites-card-content">

                                        <h2>{product.name}</h2>

                                        <p>{product.description}</p>

                                        <span className="favorites-date">
                                            Guardado el{" "}
                                            {favorite.createdAt
                                                ? new Date(
                                                    favorite.createdAt
                                                ).toLocaleDateString("es-AR")
                                                : "Fecha no disponible"}
                                        </span>

                                        <span className="favorites-view-detail">
                                            Ver alojamiento →
                                        </span>

                                    </div>

                                </article>
                            );
                        })}

                    </section>
                )}

            </main>

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}