import React from "react";
import "../../styles/ProductDescription.css";

export default function ProductDescription({ product }) {

    const features = Array.isArray(product.features)
        ? product.features
        : [];

    return (

        <section className="product-description">

            <div className="product-description-heading">

                <div>

                    <span className="product-description-label">
                        CONOCÉ EL ALOJAMIENTO
                    </span>

                    <h3>Sobre este lugar</h3>

                </div>

                {product.category?.title && (

                    <span className="product-category-badge">
                        🟢 {product.category.title}
                    </span>

                )}

            </div>

            <p>
                {product.description ||
                    "No hay descripción disponible para este alojamiento."}
            </p>

            {features.length > 0 && (

                <div className="product-detail-features">

                    <h4>
                        ¿Qué ofrece este alojamiento?
                    </h4>

                    <div className="product-detail-features-grid">

                        {features.map(feature => (

                            <div
                                className="product-detail-feature"
                                key={feature.id}
                            >

                                <span className="product-detail-feature-icon">
                                    {feature.icon}
                                </span>

                                <span>
                                    {feature.name}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </section>

    );
}