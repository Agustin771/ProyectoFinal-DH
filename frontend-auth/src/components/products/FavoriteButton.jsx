import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteButton({ productId }) {

    const { isAuthenticated } = useAuth();

    const { isFavorite, toggleFavorite } = useFavorites();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthenticated) {
        return null;
    }

    const favorite = isFavorite(productId);

    async function handleClick(event) {

        event.stopPropagation();

        if (processing) return;

        try {
            setProcessing(true);
            setError("");

            await toggleFavorite(productId);

        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudo actualizar el favorito");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="favorite-button-container">

            <button
                type="button"
                className={`favorite-button ${favorite ? "active" : ""}`}
                onClick={handleClick}
                disabled={processing}
                aria-label={
                    favorite
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                }
                aria-pressed={favorite}
                title={
                    favorite
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                }
            >
                {favorite ? "♥" : "♡"}
            </button>

            {error && (
                <span className="favorite-error" role="alert">
                    {error}
                </span>
            )}

        </div>
    );
}
