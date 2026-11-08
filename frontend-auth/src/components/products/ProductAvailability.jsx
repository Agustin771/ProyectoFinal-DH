import React, { useEffect, useState, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/ProductAvailability.css";

import { getProductAvailability } from "../../services/productService";

export default function ProductAvailability({
    productId,
    onContinueReservation
}) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dateError, setDateError] = useState("");
    const [dates, setDates] = useState([null, null]);
    const [selectingEndDate, setSelectingEndDate] = useState(false);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseDate = (date) => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const clearDates = () => {
        setDates([null, null]);
        setSelectingEndDate(false);
        setDateError("");
        onContinueReservation?.(null);
    };

    const loadAvailability = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const today = new Date();

            const startDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            const endDate = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                1
            );

            const data = await getProductAvailability(
                productId,
                formatDate(startDate),
                formatDate(endDate)
            );

            setReservations(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error al consultar disponibilidad:", err);
            setError(
                "No podemos consultar las fechas disponibles en este momento."
            );
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        setDates([null, null]);
        setSelectingEndDate(false);
        onContinueReservation?.(null);
        loadAvailability();
    }, [loadAvailability]);

    const isOccupied = (date) => {
        return reservations.some(reservation => {
            const start = parseDate(reservation.startDate);
            const end = parseDate(reservation.endDate);

            return date >= start && date < end;
        });
    };

    const handleDateChange = (value) => {
        setDateError("");
        onContinueReservation?.(null);

        if (!selectingEndDate || !dates[0]) {
            setDates([value, null]);
            setSelectingEndDate(true);
            return;
        }

        const startDate = dates[0];
        const endDate = value;

        if (endDate <= startDate) {
            setDates([endDate, null]);
            setSelectingEndDate(true);
            return;
        }

        const hasOccupiedDate = reservations.some(reservation => {
            const start = parseDate(reservation.startDate);
            const end = parseDate(reservation.endDate);

            return startDate < end && endDate > start;
        });

        if (hasOccupiedDate) {
            setDateError(
                "El período seleccionado incluye fechas ocupadas. Elegí otro rango."
            );

            setDates([null, null]);
            setSelectingEndDate(false);
            return;
        }

        setDates([startDate, endDate]);
        setSelectingEndDate(false);
    };

    const formatSelectedDate = (date) =>
        date?.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    const handleContinue = () => {
        if (!dates[0] || !dates[1]) return;

        onContinueReservation?.({
            startDate: formatDate(dates[0]),
            endDate: formatDate(dates[1])
        });
    };

    if (loading) {
        return (
            <section className="product-availability">
                <div className="availability-loading">
                    <span className="availability-spinner"></span>
                    <p>Consultando disponibilidad...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="product-availability">
                <div className="availability-error" role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={loadAvailability}>
                        Reintentar
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="product-availability">

            <div className="availability-heading">
                <span className="availability-eyebrow">
                    PLANIFICÁ TU ESTADÍA
                </span>

                <h3>Disponibilidad del alojamiento</h3>

                <p>
                    Seleccioná las fechas en las que te gustaría reservar.
                </p>
            </div>

            <div className="availability-legend">
                <span>
                    <i className="available-indicator"></i>
                    Disponible
                </span>

                <span>
                    <i className="occupied-indicator"></i>
                    Ocupado
                </span>

                <span>
                    <i className="selected-indicator"></i>
                    Seleccionado
                </span>
            </div>

            <div className="availability-calendar-container">
                <Calendar
                    className="modal-calendar"
                    showDoubleView
                    minDate={new Date()}
                    value={dates[0] || null}
                    onChange={handleDateChange}
                    tileDisabled={({ date, view }) =>
                        view === "month" && isOccupied(date)
                    }
                    tileClassName={({ date, view }) => {
                        if (view !== "month") return null;

                        const classes = [];

                        if (isOccupied(date)) {
                            classes.push("occupied-date");
                        }

                        if (
                            dates[0] &&
                            date.getTime() === dates[0].getTime()
                        ) {
                            classes.push("custom-range-start");
                        }

                        if (
                            dates[1] &&
                            date.getTime() === dates[1].getTime()
                        ) {
                            classes.push("custom-range-end");
                        }

                        if (
                            dates[0] &&
                            dates[1] &&
                            date > dates[0] &&
                            date < dates[1]
                        ) {
                            classes.push("custom-range-middle");
                        }

                        return classes.join(" ") || null;
                    }}
                    locale="es-AR"
                    next2Label="»"
                    prev2Label="«"
                    nextLabel="›"
                    prevLabel="‹"
                    showNeighboringMonth={false}
                />
            </div>

            {(dates[0] || dates[1]) && (
                <div className="availability-clear-container">
                    <button
                        type="button"
                        className="availability-clear-button"
                        onClick={clearDates}
                    >
                        ✕ Limpiar selección
                    </button>
                </div>
            )}

            {dateError && (
                <p className="availability-date-error" role="alert">
                    <span>⚠</span> {dateError}
                </p>
            )}

            {dates[0] && dates[1] && (
                <>
                    <div className="availability-selection">
                        <div>
                            <span>ENTRADA</span>
                            <strong>{formatSelectedDate(dates[0])}</strong>
                        </div>

                        <div>
                            <span>SALIDA</span>
                            <strong>{formatSelectedDate(dates[1])}</strong>
                        </div>
                    </div>

                    <div className="availability-continue">
                        <button
                            type="button"
                            onClick={handleContinue}
                        >
                            Continuar con la reserva →
                        </button>
                    </div>
                </>
            )}

        </section>
    );
}
