import "../../styles/ProductPolicies.css";

const defaultPolicies = [
    {
        id: 1,
        title: "Condiciones de reserva",
        description:
            "La reserva está sujeta a disponibilidad. Las cancelaciones y modificaciones deben realizarse con anticipación, según las condiciones establecidas por el alojamiento."
    },
    {
        id: 2,
        title: "Recomendaciones para el viaje",
        description:
            "Se recomienda verificar la documentación necesaria, respetar los horarios de ingreso y salida, y seguir las indicaciones del alojamiento durante la estadía."
    }
];

export default function ProductPolicies({
    items = defaultPolicies
}) {
    return (
        <section className="product-policies">

            <h2 className="product-policies__title">
                Políticas de uso del producto
            </h2>

            <div className="product-policies__grid">

                {items.map((policy, index) => (
                    <article
                        className="product-policies__item"
                        key={policy.id ?? index}
                    >
                        <h3>{policy.title}</h3>

                        <p>{policy.description}</p>
                    </article>
                ))}

            </div>

        </section>
    );
}
