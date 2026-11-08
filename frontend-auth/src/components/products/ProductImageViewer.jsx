import React, { useState, useEffect } from "react";
import "../../styles/ProductImageViewer.css";

export default function ProductImageViewer({
    images,
    productName,
    onClose
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalImages = images.length;

    const previousImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? totalImages - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === totalImages - 1 ? 0 : prev + 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") previousImage();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, totalImages]);

    if (!totalImages) return null;

    return (
        <div
            className="product-viewer-overlay"
            onClick={onClose}
        >
            <section
                className="product-viewer"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`Galería de imágenes de ${productName}`}
            >

            <header className="product-viewer-header">
                <h2>{productName}</h2>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar galería"
                >
                    ✕
                </button>
            </header>

         

            <div className="product-viewer-content">
                <div className="product-viewer-main">
                    <img
                        key={images[currentIndex]}
                        src={images[currentIndex]}
                        alt={`${productName} - imagen ${currentIndex + 1}`}
                    />
                    {totalImages > 1 && (
                        <>
                            <button
                                type="button"
                                className="viewer-arrow viewer-arrow-left"
                                onClick={previousImage}
                                aria-label="Imagen anterior"
                            >
                                &#10094;
                            </button>

                            <button
                                type="button"
                                className="viewer-arrow viewer-arrow-right"
                                onClick={nextImage}
                                aria-label="Imagen siguiente"
                            >
                                &#10095;
                            </button>
                        </>
                    )}
                    <span className="viewer-counter">
                        {currentIndex + 1} / {totalImages}
                    </span>

                </div>
                {totalImages > 1 && (
                    <div className="product-viewer-thumbnails">

                        {images.map((image, index) => (
                            <button
                                type="button"
                                key={`${image}-${index}`}
                                className={`viewer-thumbnail ${
                                    currentIndex === index ? "active" : ""
                                }`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Ver imagen ${index + 1}`}
                                aria-current={
                                    currentIndex === index ? "true" : undefined
                                }
                            >
                                <img
                                    src={image}
                                    alt={`Miniatura ${index + 1}`}
                                />
                            </button>
                        ))}

                    </div>
                )}

            </div>

            </section>
        </div>
    );
}
