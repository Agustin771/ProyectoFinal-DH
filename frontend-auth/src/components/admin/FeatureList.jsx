import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "/api/features";

export default function FeatureList() {

    const { apiFetch } = useAuth();
    const [features, setFeatures] = useState([]);
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadFeatures = async () => {

        setLoading(true);

        try {
            const response = await apiFetch(API_URL);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    typeof data === "string"
                        ? data
                        : "No se pudieron cargar las características."
                );
            }
            setFeatures(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeatures();
    }, []);

    const resetForm = () => {
        setName("");
        setIcon("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !icon.trim()) {
            setError("Completá el nombre y el ícono.");
            return;
        }

        setSaving(true);

        try {

            const payload = {
                name: name.trim(),
                icon: icon.trim()
            };

            const response = await apiFetch(
                editingId
                    ? `${API_URL}/${editingId}`
                    : API_URL,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "No se pudo guardar la característica."
                );
            }

            setSuccess(
                editingId
                    ? "¡Característica actualizada correctamente!"
                    : "¡Característica creada correctamente!"
            );

            resetForm();

            await loadFeatures();

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }
    };

    const handleEdit = (feature) => {

        setEditingId(feature.id);
        setName(feature.name);
        setIcon(feature.icon);

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "¿Estás seguro de eliminar esta característica?"
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {

            const response = await apiFetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "No se pudo eliminar la característica."
                );
            }

            if (editingId === id) {
                resetForm();
            }

            setSuccess("Característica eliminada correctamente.");

            await loadFeatures();

        } catch (err) {

            setError(err.message);

        }
    };

    return (

        <main className="admin-dashboard">

            {/* HEADER */}

            <header className="admin-header">

                <div className="admin-header-content">

                    <span className="admin-eyebrow">
                        ADMINISTRACIÓN
                    </span>

                    <h1>Administrar características</h1>

                    <p>
                        Gestioná las características disponibles
                        para tus productos.
                    </p>

                    <Link
                        to="/admin"
                        className="admin-back-button"
                        style={{ marginTop: "20px" }}
                    >
                        ← Volver al administrador
                    </Link>

                </div>

            </header>

            <section className="admin-container">

                <div className="admin-form-wrapper">

                    <div className="admin-section-heading">

                        <div className="admin-icon">
                            ✨
                        </div>

                        <div>
                            <h2>
                                {editingId
                                    ? "Editar característica"
                                    : "Añadir nueva"
                                }
                            </h2>

                            <p>
                                Indicá el nombre y el ícono asociado.
                            </p>
                        </div>

                    </div>

                    <div className="admin-form-card">

                        <form onSubmit={handleSubmit}>

                            {error && (
                                <div className="admin-message error-message">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="admin-message success-message">
                                    {success}
                                </div>
                            )}

                            <div className="admin-form-group">

                                <label htmlFor="feature-name">
                                    Nombre de la característica
                                </label>

                                <input
                                    id="feature-name"
                                    type="text"
                                    placeholder="Ej: Bluetooth"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="admin-form-group">

                                <label htmlFor="feature-icon">
                                    Ícono asociado
                                </label>

                                <input
                                    id="feature-icon"
                                    type="text"
                                    placeholder="Ej: 📶"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    required
                                />

                                <small>
                                    Podés utilizar un emoji como ícono.
                                </small>

                            </div>

                            {icon.trim() && (

                                <div className="feature-icon-preview">

                                    <span>
                                        {icon}
                                    </span>

                                    <div>
                                        <strong>Vista previa</strong>
                                        <small>Así se verá el ícono.</small>
                                    </div>

                                </div>

                            )}

                            <button
                                type="submit"
                                className="admin-submit-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Guardando..."
                                    : editingId
                                        ? "Guardar cambios"
                                        : "+ Añadir característica"
                                }
                            </button>
                            {editingId && (

                                <button
                                    type="button"
                                    className="feature-cancel-button"
                                    onClick={resetForm}
                                >
                                    Cancelar edición
                                </button>

                            )}
                        </form>
                    </div>
                </div>

                <div className="admin-form-wrapper">

                    <div className="admin-section-heading">

                        <div className="admin-icon">
                            🏷️
                        </div>

                        <div>
                            <h2>Características registradas</h2>

                            <p>
                                {features.length} características disponibles.
                            </p>
                        </div>

                    </div>

                    <div className="admin-form-card">

                        {loading ? (

                            <p className="feature-empty">
                                Cargando características...
                            </p>

                        ) : features.length === 0 ? (

                            <div className="feature-empty">

                                <span>🏷️</span>

                                <h3>Todavía no hay características</h3>

                                <p>
                                    Añadí tu primera característica
                                    utilizando el formulario.
                                </p>

                            </div>

                        ) : (

                            <div className="feature-list">

                                {features.map((feature) => (

                                    <div
                                        className="feature-item"
                                        key={feature.id}
                                    >

                                    <div className="feature-item-info">

                                        <div className="feature-item-icon">
                                            {feature.icon}
                                        </div>
                                            <div className="feature-item-text">
                                                <strong>
                                                    {feature.name}
                                                </strong>

                                                <small>
                                                    Característica #{feature.id}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="feature-item-actions">

                                            <button
                                                type="button"
                                                className="feature-edit-button"
                                                onClick={() => handleEdit(feature)}
                                                aria-label={`Editar ${feature.name}`}
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                type="button"
                                                className="feature-delete-button"
                                                onClick={() => handleDelete(feature.id)}
                                                aria-label={`Eliminar ${feature.name}`}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
