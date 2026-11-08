import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import "../../styles/ProductReviews.css";

export default function ProductReviews({ productId }) {
    const { isAuthenticated, apiFetch } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

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

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [reviewsRes, summaryRes] = await Promise.all([
                apiFetch(`/api/products/${productId}/reviews`, { method: "GET" }),
                apiFetch(`/api/products/${productId}/reviews/summary`, { method: "GET" })
            ]);

            const reviewsData = await readResponse(reviewsRes);
            const summaryData = await readResponse(summaryRes);

            if (!reviewsRes.ok) {
                throw new Error(getErrorMessage(reviewsData, "Error al obtener las reseñas"));
            }
            if (!summaryRes.ok) {
                throw new Error(getErrorMessage(summaryData, "Error al obtener el resumen"));
            }

            setReviews(Array.isArray(reviewsData) ? reviewsData : []);
            setSummary(summaryData || { averageRating: 0, totalReviews: 0 });
        } catch (err) {
            console.error("Error al cargar reseñas:", err);
            setError("No se pudieron cargar las valoraciones.");
        } finally {
            setLoading(false);
        }
    }, [productId, apiFetch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmitReview = async (e) => {
            e.preventDefault();
            setFormError("");
            setFormSuccess("");
            setSubmitting(true);

            try {
                const response = await apiFetch(`/api/products/${productId}/reviews`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ rating, comment })
                });

                const text = await response.text();
                let data = {};
                try {
                    data = text ? JSON.parse(text) : {};
                } catch {
                    data = text; // Si no es JSON (es texto plano), guardamos el texto directo
                }

                if (!response.ok) {
                    const errorMessage = typeof data === "string" ? data : (data.message || "Error al crear la reseña");
                    throw new Error(errorMessage);
                }

                setFormSuccess("¡Reseña publicada con éxito!");
                setComment("");
                setRating(5);
                await loadData();
            } catch (err) {
                setFormError(err.message || "Error al enviar la reseña.");
            } finally {
                setSubmitting(false);
            }
    };

    const renderStars = (value) => {
        return "★".repeat(value) + "☆".repeat(5 - value);
    };

    if (loading) {
        return <div className="reviews-loading">Cargando valoraciones...</div>;
    }

    return (
        <section className="product-reviews-section">
            <div className="reviews-header">
                <h3>Opiniones y Valoraciones</h3>
                <div className="reviews-summary-badge">
                    <span className="summary-stars">
                        {renderStars(Math.round(summary.averageRating || 0))}
                    </span>
                    <span className="summary-score">
                        {Number(summary.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="summary-count">
                        ({summary.totalReviews} {summary.totalReviews === 1 ? "valoración" : "valoraciones"})
                    </span>
                </div>
            </div>

            {error && <p className="reviews-error">{error}</p>}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
                ) : (
                    reviews.map((rev, index) => (
                        <div key={rev.id || index} className="review-card">
                            <div className="review-card-header">
                                <span className="review-author">{rev.userName || "Usuario"}</span>
                                <span className="review-date">
                                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("es-AR") : ""}
                                </span>
                            </div>
                            <div className="review-stars">{renderStars(rev.rating)}</div>
                            {rev.comment && <p className="review-comment">{rev.comment}</p>}
                        </div>
                    ))
                )}
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="review-form">
                    <h4>Escribí tu reseña</h4>
                    {formError && <p className="form-error">{formError}</p>}
                    {formSuccess && <p className="form-success">{formSuccess}</p>}

                    <div className="form-group">
                        <label>Puntuación (1 a 5 estrellas):</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            <option value={5}>★★★★★ (5 - Excelente)</option>
                            <option value={4}>★★★★☆ (4 - Muy bueno)</option>
                            <option value={3}>★★★☆☆ (3 - Bueno)</option>
                            <option value={2}>★★☆☆☆ (2 - Regular)</option>
                            <option value={1}>★☆☆☆☆ (1 - Malo)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Comentario (opcional):</label>
                        <textarea
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Contá cómo fue tu experiencia..."
                        />
                    </div>

                    <button type="submit" disabled={submitting} className="submit-review-btn">
                        {submitting ? "Enviando..." : "Publicar reseña"}
                    </button>
                </form>
            ) : (
                <p className="auth-prompt">Iniciá sesión para poder calificar y dejar una reseña en este producto.</p>
            )}
        </section>
    );
}