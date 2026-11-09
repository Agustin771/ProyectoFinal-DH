import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../components/context/AuthContext";
import { getMyReservations } from "../services/reservationService";
import "../styles/responsive.css";
import "../styles/myReservations.css";

export default function MyReservations() {

    const { isAuthenticated, apiFetch } = useAuth();

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        let active = true;

        async function loadReservations() {

            try {
                setLoading(true);
                setError("");

                const data = await getMyReservations(apiFetch);

                if (active) {
                    setReservations(data);
                }

            } catch (error) {

                if (active) {
                    setError(
                        error.message ||
                        "No se pudieron cargar tus reservas."
                    );
                }

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        }

        if (isAuthenticated) {
            loadReservations();
        }

        return () => {
            active = false;
        };

    }, [isAuthenticated, apiFetch]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    function formatDate(date) {

        if (!date) return "Fecha no disponible";

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

    function calculateNights(startDate, endDate) {

        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T00:00:00`);

        return Math.round(
            (end - start) / (1000 * 60 * 60 * 24)
        );
    }

    return (

        <main className="my-reservations-page">

            <div className="page-back-wrapper">
                <Link to="/" className="my-reservations-back">
                    <span aria-hidden="true">←</span>
                    Volver a la tienda
                </Link>
            </div>

            <header className="my-reservations-header">

                <span className="my-reservations-eyebrow">
                    TUS VIAJES
                </span>

                <h1>Mis reservas</h1>

                <p>
                    Consultá tus alojamientos reservados
                    y los detalles de cada estadía.
                </p>

                {!loading && !error && (
                    <span className="my-reservations-count">
                        {reservations.length}{" "}
                        {reservations.length === 1
                            ? "reserva"
                            : "reservas"}
                    </span>
                )}

            </header>

            {loading && (
                <p className="my-reservations-status">
                    Cargando tus reservas...
                </p>
            )}

            {error && (
                <div
                    className="my-reservations-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {!loading && !error && reservations.length === 0 && (

                <section className="my-reservations-empty">

                    <span className="my-reservations-empty-icon">
                        🧳
                    </span>

                    <h2>Todavía no tenés reservas</h2>

                    <p>
                        Cuando reserves un alojamiento,
                        vas a poder consultar acá todos sus detalles.
                    </p>

                    <Link
                        to="/"
                        className="my-reservations-explore"
                    >
                        Explorar alojamientos
                    </Link>

                </section> 
            )}

            {!loading && !error && reservations.length > 0 && (

                <section className="my-reservations-list">

                    {reservations.map(reservation => (

                        <article
                            className="my-reservation-card"
                            key={reservation.id}
                        >

                            <div className="my-reservation-top">

                                <div>
                                    <span className="my-reservation-label">
                                        RESERVA Nº {reservation.id}
                                    </span>

                                    <h2>
                                        {reservation.productName}
                                    </h2>
                                </div>

                                <span className="my-reservation-status">
                                    {reservation.status === "CONFIRMED"
                                        ? "Confirmada"
                                        : reservation.status}
                                </span>

                            </div>

                            <div className="my-reservation-details">

                                <div>
                                    <span>Entrada</span>
                                    <strong>
                                        {formatDate(reservation.startDate)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Salida</span>
                                    <strong>
                                        {formatDate(reservation.endDate)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Duración</span>
                                    <strong>
                                        {calculateNights(
                                            reservation.startDate,
                                            reservation.endDate
                                        )} noches
                                    </strong>
                                </div>

                            </div>

                            <div className="my-reservation-footer">

                                <span>
                                    Código de reserva: #{reservation.id}
                                </span>

                                <span>
                                    Estado: {reservation.status}
                                </span>

                            </div>

                        </article>

                    ))}

                </section>
            )}
        </main>
    );
}
