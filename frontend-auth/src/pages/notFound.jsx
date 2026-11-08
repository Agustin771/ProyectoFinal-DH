import { Link } from "react-router-dom";
import "../styles/notFound.css";

export default function NotFound() {
    return (
        <main className="not-found">
            <div className="not-found__background">
                <span className="not-found__cloud not-found__cloud--one" />
                <span className="not-found__cloud not-found__cloud--two" />
                <span className="not-found__cloud not-found__cloud--three" />
            </div>

            <section className="not-found__content">

                <div className="not-found__brand">
                    <span className="not-found__brand-icon">✦</span>
                    Reserva<span>Ya</span>
                </div>

                <div className="not-found__ticket">

                    <div className="not-found__ticket-top">
                        <span className="not-found__badge">
                            ERROR 404
                        </span>

                        <span className="not-found__ticket-label">
                            DESTINO NO ENCONTRADO
                        </span>
                    </div>

                    <div className="not-found__illustration">
                        <div className="not-found__route">
                            <span className="not-found__route-dot" />
                            <span className="not-found__plane">✈</span>
                            <span className="not-found__route-dot" />
                        </div>

                        <h1 className="not-found__title">
                            4<span>0</span>4
                        </h1>

                        <div className="not-found__location">
                            <span>📍</span>
                            DESTINO DESCONOCIDO
                        </div>
                    </div>

                    <div className="not-found__message">
                        <h2>
                            ¡Ups! Parece que te
                            <span> perdiste en el viaje.</span>
                        </h2>

                        <p>
                            Esta página tomó otro vuelo o quizás
                            nunca estuvo en nuestro itinerario.
                            ¡Pero todavía podemos llevarte a tu
                            próximo destino!
                        </p>
                    </div>

                    <div className="not-found__ticket-divider">
                        <span />
                        <span />
                    </div>

                    <div className="not-found__ticket-footer">
                        <div className="not-found__ticket-info">
                            <span>PRÓXIMA PARADA</span>
                            <strong>INICIO</strong>
                        </div>

                        <Link to="/" className="not-found__button">
                            Volver al inicio
                            <span>→</span>
                        </Link>
                    </div>

                </div>

                <p className="not-found__footer">
                    <span>✦</span>
                    Tu próximo destino empieza acá
                </p>

            </section>
        </main>
    );
}