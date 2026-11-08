import React, { useState } from "react";
import "../../styles/ProductShare.css";

export default function ProductShare({ product, onClose }) {

    const [message, setMessage] = useState(
        `¡Mirá este lugar increíble para tus próximas vacaciones! ${product.name}`
    );

    const [selectedNetwork, setSelectedNetwork] = useState("facebook");

    const productUrl =
        `${window.location.origin}/?product=${encodeURIComponent(product.id)}`;

    const shareText = `${message}\n${productUrl}`;

    const shareOptions = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,

        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(productUrl)}`
    };

    async function handleShare() {

        if (selectedNetwork === "instagram") {

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: product.name,
                        text: message,
                        url: productUrl
                    });
                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error(error);
                    }
                }
            } else {
                try {
                    await navigator.clipboard.writeText(shareText);
                    alert("¡Contenido copiado!");
                } catch (error) {
                    alert("No se pudo copiar el contenido.");
                }
            }

            return;
        }

        if (selectedNetwork === "copy") {

            try {
                await navigator.clipboard.writeText(shareText);
                alert("¡Enlace copiado correctamente!");
            } catch (error) {
                alert("No se pudo copiar el enlace.");
            }

            return;
        }

        window.open(
            shareOptions[selectedNetwork],
            "_blank",
            "noopener,noreferrer"
        );
    }

    return (

        <div
            className="share-overlay"
            onClick={onClose}
        >

            <section
                className="product-share-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-title"
            >

                <header className="share-header">

                    <h2 id="share-title">
                        Compartir producto
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                </header>

                <div className="share-content">

                    <div className="share-preview">

                        {product.images?.[0] && (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                            />
                        )}

                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                        </div>

                    </div>

                    <label htmlFor="share-message">
                        Personalizá tu mensaje
                    </label>

                    <textarea
                        id="share-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                    />

                    <label htmlFor="share-network">
                        Elegí dónde compartir
                    </label>

                    <select
                        id="share-network"
                        value={selectedNetwork}
                        onChange={(e) => setSelectedNetwork(e.target.value)}
                    >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">X / Twitter</option>
                        <option value="instagram">Instagram / Compartir</option>
                        <option value="copy">Copiar enlace</option>
                    </select>

                    <button
                        type="button"
                        className="share-submit"
                        onClick={handleShare}
                    >
                        Compartir
                    </button>

                </div>

            </section>

        </div>
    );
}
