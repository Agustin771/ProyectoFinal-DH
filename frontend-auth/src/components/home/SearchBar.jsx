import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/SearchAvailability.css";

import {
    getAllProducts,
    searchProducts
} from "../../services/productService";

export default function SearchBar({ onSearchResults }) {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [dates, setDates] = useState([null, null]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllProducts()
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    const handleKeywordChange = (value) => {
        setKeyword(value);

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = products.filter(product =>
            product.name?.toLowerCase().includes(value.trim().toLowerCase())
        );

        setSuggestions(filtered.slice(0, 5));
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (date) => {
        if (!date) return "Seleccionar";

        return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const handleSearch = async () => {
        if (!dates[0] || !dates[1]) {
            setError("Seleccioná una fecha de entrada y una de salida.");
            return;
        }

        if (dates[1] <= dates[0]) {
            setError("La salida debe ser posterior a la entrada.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const results = await searchProducts(
                keyword,
                formatDate(dates[0]),
                formatDate(dates[1])
            );

            onSearchResults(results);
            setSuggestions([]);
        } catch (err) {
            setError(err.message || "No pudimos realizar la búsqueda.");
        } finally {
            setLoading(false);
        }
    };

    const clearDates = () => {
        setDates([null, null]);
        setError("");
    };

    return (
        <section className="search-section">

            <div className="search-heading">
                <span className="search-eyebrow">
                    ENCONTRÁ TU PRÓXIMA EXPERIENCIA
                </span>

                <h1>Encontrá tu próximo destino</h1>

                <p>
                    Buscá alojamientos y productos según tus preferencias
                    y las fechas en las que querés disfrutar tu estadía.
                </p>
            </div>

            <div className="search-content">

                <div className="search-field">
                    <label htmlFor="product-search">
                        ¿QUÉ ESTÁS BUSCANDO?
                    </label>

                    <div className="search-input-container">
                        <span className="search-field-icon">⌕</span>

                        <input
                            id="product-search"
                            type="text"
                            value={keyword}
                            onChange={(e) =>
                                handleKeywordChange(e.target.value)
                            }
                            onFocus={() => {
                                if (keyword.trim()) {
                                    handleKeywordChange(keyword);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setSuggestions([]);
                                }
                            }}
                            placeholder="Ej. Hotel, cabaña, auto..."
                            autoComplete="off"
                        />

                        {suggestions.length > 0 && (
                            <ul className="search-suggestions">
                                {suggestions.map(product => (
                                    <li key={product.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setKeyword(product.name);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {product.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <p className="search-field-hint">
                        Podés buscar por nombre o tipo de producto.
                    </p>
                </div>

                <div className="search-calendar">

                    <div className="calendar-heading">
                        <div>
                            <label>FECHAS DE TU ESTADÍA</label>
                            <p>Seleccioná entrada y salida</p>
                        </div>

                        <div className="calendar-selected-dates">
                            <div>
                                <span>ENTRADA</span>
                                <strong>{formatDisplayDate(dates[0])}</strong>
                            </div>

                            <div>
                                <span>SALIDA</span>
                                <strong>{formatDisplayDate(dates[1])}</strong>
                            </div>
                        </div>
                    </div>

                    <Calendar
                        className="home-calendar"
                        selectRange
                        minDate={new Date()}
                        value={dates}
                        onChange={(value) => {
                            setDates(value);
                            setError("");
                        }}
                        locale="es-AR"
                        nextLabel="›"
                        prevLabel="‹"
                        next2Label="»"
                        prev2Label="«"
                        showNeighboringMonth={false}
                    />
                    {(dates[0] || dates[1]) && (
                        <div className="search-clear-container">
                            <button
                                type="button"
                                className="search-clear-button"
                                onClick={clearDates}
                            >
                                ✕ Limpiar selección
                            </button>
                        </div>
                    )}
                </div>

                <div className="search-actions">
                    {error && (
                        <p className="search-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        className="search-submit-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? (
                            "Buscando..."
                        ) : (
                            <>
                                <span>⌕</span>
                                Realizar búsqueda
                            </>
                        )}
                    </button>

                    <span className="search-action-hint">
                        Encontrá opciones disponibles para tus fechas.
                    </span>
                </div>
            </div>
        </section>
    );
}