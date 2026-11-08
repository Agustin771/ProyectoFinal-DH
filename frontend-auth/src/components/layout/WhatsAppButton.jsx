import { useState } from "react";

import "../../styles/whatsappButton.css";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function WhatsAppButton({ product }) {

    const [message, setMessage] = useState("");

    function handleWhatsAppClick() {

        setMessage("");

        if (!WHATSAPP_NUMBER) {
            setMessage(
                "El contacto por WhatsApp no está configurado."
            );
            return;
        }

        const validNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

        if (!validNumber) {
            setMessage(
                "El número de WhatsApp configurado no es válido."
            );
            return;
        }

        if (!navigator.onLine) {
            setMessage(
                "No tenés conexión a Internet. Intentá nuevamente."
            );
            return;
        }

        const text = product
            ? `Hola, quisiera consultar por el alojamiento: ${product.name}.`
            : "Hola, quisiera hacer una consulta sobre sus alojamientos.";

        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

        const whatsappWindow = window.open(url, "_blank");

        if (!whatsappWindow) {
            setMessage(
                "No se pudo abrir WhatsApp. Revisá si el navegador bloqueó la ventana."
            );
            return;
        }

        whatsappWindow.opener = null;

        setMessage(
            "Se abrió WhatsApp con tu mensaje preparado. ¡Solo falta enviarlo!"
        );
    }

    return (
        <div className="whatsapp-container">

            {message && (
                <div
                    className="whatsapp-feedback"
                    role="status"
                >
                    {message}

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Cerrar mensaje"
                    >
                        ×
                    </button>
                </div>
            )}

            <button
                type="button"
                className="whatsapp-button"
                onClick={handleWhatsAppClick}
                aria-label="Contactar por WhatsApp"
                title="Contactanos por WhatsApp"
            >

                <svg
                    viewBox="0 0 32 32"
                    width="30"
                    height="30"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M16 .5C7.45.5.5 7.45.5 16c0 2.73.72 5.4 2.09 7.75L.5 31.5l7.94-2.08A15.43 15.43 0 0 0 16 31.5c8.55 0 15.5-6.95 15.5-15.5S24.55.5 16 .5Zm0 28.16c-2.38 0-4.72-.64-6.76-1.85l-.48-.28-4.72 1.24 1.26-4.6-.31-.5A12.65 12.65 0 0 1 3.84 16C3.84 9.3 9.3 3.84 16 3.84S28.16 9.3 28.16 16 22.7 28.66 16 28.66Zm6.94-9.48c-.38-.19-2.25-1.11-2.6-1.24-.35-.13-.6-.19-.85.19-.25.38-.98 1.24-1.2 1.49-.22.25-.44.28-.82.09-.38-.19-1.59-.59-3.02-1.87-1.12-.99-1.87-2.21-2.09-2.59-.22-.38-.02-.59.17-.78.17-.17.38-.44.57-.66.19-.22.25-.38.38-.63.13-.25.06-.47-.03-.66-.09-.19-.85-2.05-1.16-2.81-.3-.73-.61-.63-.85-.64h-.73c-.25 0-.66.09-1.01.47-.35.38-1.33 1.3-1.33 3.16s1.36 3.67 1.55 3.92c.19.25 2.68 4.09 6.49 5.74.91.39 1.62.63 2.17.81.91.29 1.74.25 2.4.15.73-.11 2.25-.92 2.57-1.81.32-.89.32-1.65.22-1.81-.09-.16-.35-.25-.73-.44Z"/>
                </svg>

                <span>WhatsApp</span>

            </button>

        </div>
    );
}
