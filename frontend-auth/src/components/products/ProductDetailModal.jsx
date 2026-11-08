import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import ProductReviews from "./ProductReviews";
import ProductGallery from "./ProductGallery";
import ProductDescription from "./ProductDescription";
import ProductAvailability from "./ProductAvailability";
import ProductPolicies from "./ProductPolicies";
import ProductShare from "./ProductShare";

import { createReservation } from "../../services/reservationService";

import "../../styles/ProductDetailModal.css";

export default function ProductDetailModal({
    product,
    onClose,
    onLoginRequired
}) {

    const { isAuthenticated, apiFetch } = useAuth();

    const [showShare, setShowShare] = useState(false);

    const [reservationDates, setReservationDates] = useState(null);
    const [showReservationSummary, setShowReservationSummary] = useState(false);

    const [submittingReservation, setSubmittingReservation] = useState(false);
    const [reservationError, setReservationError] = useState("");
    const [reservationResult, setReservationResult] = useState(null);

function handleDatesSelected(dates) {
    setReservationDates(dates);
    setShowReservationSummary(Boolean(dates));
    setReservationError("");
    setReservationResult(null);
}

    function formatDate(date) {
        if (!date) return "";

        const [year, month, day] = date.split("-");

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        ).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    function calculateNights() {
        if (!reservationDates) return 0;

        const start = new Date(
            `${reservationDates.startDate}T00:00:00`
        );

        const end = new Date(
            `${reservationDates.endDate}T00:00:00`
        );

        return Math.round(
            (end - start) / (1000 * 60 * 60 * 24)
        );
    }

    function handleContinueReservation() {
        if (!reservationDates) return;

        setReservationError("");
        setShowReservationSummary(true);
    }

    async function handleConfirmReservation() {

        if (!reservationDates || submittingReservation) return;

        if (!isAuthenticated) {
            setReservationError(
                "Iniciá sesión para poder confirmar tu reserva."
            );

            onLoginRequired?.();
            return;
        }

        try {
            setSubmittingReservation(true);
            setReservationError("");

            const reservation = await createReservation(
                product.id,
                reservationDates.startDate,
                reservationDates.endDate,
                apiFetch
            );

            setReservationResult(reservation);

        } catch (error) {
            console.error("Error al confirmar reserva:", error);

            setReservationError(
                error.message || "No se pudo confirmar la reserva."
            );

        } finally {
            setSubmittingReservation(false);
        }
    }

    return (
        <div
            className="product-modal-overlay"
            onClick={onClose}
        >
            <section
                className="product-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
            >

                <header className="product-modal-header">

                    <h2 id="product-modal-title">
                        {product.name}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Volver atrás"
                        className="product-modal-back"
                    >
                        ←
                    </button>

                </header>

                <div className="product-modal-body">

                    <ProductGallery
                        images={product.images || []}
                        productName={product.name}
                    />

                    <ProductDescription
                        product={product}
                    />

                    <ProductAvailability
                        productId={product.id}
                        onContinueReservation={handleDatesSelected}
                    />

                    {reservationDates && !reservationResult && (
                        <section className="reservation-summary">

                            <h3>Resumen de tu reserva</h3>

                            <div className="reservation-summary-details">

                                <div>
                                    <span>Alojamiento</span>
                                    <strong>{product.name}</strong>
                                </div>

                                <div>
                                    <span>Fecha de entrada</span>
                                    <strong>
                                        {formatDate(reservationDates.startDate)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fecha de salida</span>
                                    <strong>
                                        {formatDate(reservationDates.endDate)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Duración de la estadía</span>
                                    <strong>
                                        {calculateNights()} noches
                                    </strong>
                                </div>

                            </div>

                            {!showReservationSummary && (
                                <button
                                    type="button"
                                    className="reservation-review-button"
                                    onClick={handleContinueReservation}
                                >
                                    Revisar reserva
                                </button>
                            )}

                            {showReservationSummary && (
                                <div className="reservation-confirmation">

                                    <p>
                                        Revisá los datos antes de confirmar
                                        tu reserva.
                                    </p>

                                    <button
                                        type="button"
                                        className="reservation-confirm-button"
                                        onClick={handleConfirmReservation}
                                        disabled={submittingReservation}
                                    >
                                        {submittingReservation
                                            ? "Confirmando..."
                                            : "Confirmar reserva"}
                                    </button>

                                </div>
                            )}

                            {reservationError && (
                                <p
                                    className="reservation-error"
                                    role="alert"
                                >
                                    {reservationError}
                                </p>
                            )}

                        </section>
                    )}

                    {reservationResult && (
                        <section
                            className="reservation-success"
                            role="status"
                        >
                            <span className="reservation-success-icon">
                                ✓
                            </span>

                            <h3>¡Reserva confirmada!</h3>

                            <p>
                                Tu reserva se registró correctamente.
                            </p>

                            <div>
                                <span>Número de reserva</span>
                                <strong>{reservationResult.id}</strong>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                            >
                                Continuar
                            </button>
                        </section>
                    )}

                    <ProductReviews
                        productId={product.id}
                    />

                    <ProductPolicies
                        items={product.policies}
                    />

                    <div className="product-share-trigger">

                        <button
                            type="button"
                            onClick={() => setShowShare(true)}
                        >
                            <span>↗</span>
                            Compartir producto
                        </button>

                    </div>

                </div>

            </section>

            {showShare && (
                <ProductShare
                    product={product}
                    onClose={() => setShowShare(false)}
                />
            )}

        </div>
    );
}
