import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef
} from "react";

import { useAuth } from "./AuthContext";

import {
    getFavorites,
    addFavorite,
    removeFavorite
} from "../../services/favoriteService";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {

    const { isAuthenticated, apiFetch } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [favoritesError, setFavoritesError] = useState("");

    const pendingOperations = useRef(new Set());

    const loadFavorites = useCallback(async () => {

        if (!isAuthenticated) {
            setFavorites([]);
            setFavoritesError("");
            setLoadingFavorites(false);
            pendingOperations.current.clear();
            return;
        }

        try {

            setLoadingFavorites(true);
            setFavoritesError("");

            const data = await getFavorites(apiFetch);

            setFavorites(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error("Error cargando favoritos:", error);

            setFavoritesError(
                error.message || "No se pudieron cargar los favoritos"
            );

        } finally {
            setLoadingFavorites(false);
        }

    }, [isAuthenticated, apiFetch]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const isFavorite = useCallback((productId) => {

        return favorites.some(
            favorite =>
                Number(favorite.product?.id) === Number(productId)
        );

    }, [favorites]);

    const toggleFavorite = useCallback(async (productId) => {

        if (!isAuthenticated) {
            throw new Error(
                "Debés iniciar sesión para guardar favoritos"
            );
        }

        if (pendingOperations.current.has(productId)) {
            return;
        }

        pendingOperations.current.add(productId);

        try {

            const existingFavorite = favorites.find(
                favorite =>
                    Number(favorite.product?.id) === Number(productId)
            );

            if (existingFavorite) {

                await removeFavorite(productId, apiFetch);

                setFavorites(current =>
                    current.filter(
                        favorite =>
                            Number(favorite.product?.id) !== Number(productId)
                    )
                );

            } else {

                const favorite = await addFavorite(productId, apiFetch);

                setFavorites(current => {

                    const alreadyExists = current.some(
                        item =>
                            Number(item.product?.id) === Number(productId)
                    );

                    if (alreadyExists) return current;

                    return [favorite, ...current];
                });
            }

        } finally {
            pendingOperations.current.delete(productId);
        }

    }, [isAuthenticated, favorites, apiFetch]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loadingFavorites,
                favoritesError,
                isFavorite,
                toggleFavorite,
                loadFavorites
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {

    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            "useFavorites debe utilizarse dentro de FavoritesProvider"
        );
    }

    return context;
}