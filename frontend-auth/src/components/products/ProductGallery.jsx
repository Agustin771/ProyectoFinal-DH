import React, { useState } from "react";
import ProductImageViewer from "./ProductImageViewer";
import "../../styles/ProductGallery.css";

export default function ProductGallery({ images = [], productName }) {
    const [showAllImages, setShowAllImages] = useState(false);

    const validImages = images.filter(Boolean);

    if (!validImages.length) {
        return (
            <div className="product-gallery-empty">
                <span>🏡</span>
                <p>No hay imágenes disponibles</p>
            </div>
        );
    }

    return (
        <>
            <div className={`product-gallery ${
                validImages.length === 1 ? "single-image" : ""
            }`}>

                <div className="product-gallery-main">
                    <img
                        src={validImages[0]}
                        alt={`${productName} - imagen principal`}
                        onClick={() => setShowAllImages(true)}
                    />
                </div>

                {validImages.length > 1 && (
                    <div className="product-gallery-grid">
                        {validImages.slice(1, 5).map((image, index) => (
                            <div
                                className="product-gallery-item"
                                key={`${image}-${index}`}
                            >
                                <img
                                    src={image}
                                    alt={`${productName} - imagen ${index + 2}`}
                                    onClick={() => setShowAllImages(true)}
                                />

                                {index === 3 && validImages.length > 5 && (
                                    <button
                                        type="button"
                                        className="product-gallery-more"
                                        onClick={() => setShowAllImages(true)}
                                    >
                                        Ver todas las fotos
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAllImages && (
                <ProductImageViewer
                    images={validImages}
                    productName={productName}
                    onClose={() => setShowAllImages(false)}
                />
            )}
        </>
    );
}
