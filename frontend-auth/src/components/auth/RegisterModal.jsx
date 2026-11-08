import { useState } from "react";
import { register } from "../../services/authService";

export default function RegisterModal({
    onClose,
    onVerificationRequested
}) {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    async function handleRegister(event) {
        event.preventDefault();

        setError("");
        setFieldErrors({});
        setSubmitting(true);

        try {
            await register(name, lastName, email, password);

            onVerificationRequested(email);
        } catch (error) {
            if (error.data?.errors) {
                setFieldErrors(error.data.errors);
            } else {
                setError(error.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div
                className="login-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="register-title"
            >
                <button
                    className="modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ×
                </button>

                <h2 id="register-title">Crear una cuenta</h2>

                <p className="modal-description">
                    Completá tus datos para registrarte.
                </p>

                <form onSubmit={handleRegister} noValidate>
                    <div className="form-group">
                        <label htmlFor="register-name">Nombre</label>
                        <input
                            id="register-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setFieldErrors(prev => ({
                                    ...prev,
                                    name: undefined
                                }));
                            }}
                            maxLength={80}
                            placeholder="Tu nombre"
                            required
                        />
                        {fieldErrors.name && (
                            <p className="login-error">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-lastname">Apellido</label>
                        <input
                            id="register-lastname"
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setFieldErrors(prev => ({
                                    ...prev,
                                    lastName: undefined
                                }));
                            }}
                            maxLength={80}
                            placeholder="Tu apellido"
                            required
                        />
                        {fieldErrors.lastName && (
                            <p className="login-error">
                                {fieldErrors.lastName}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors(prev => ({
                                    ...prev,
                                    email: undefined
                                }));
                            }}                            
                            placeholder="tu@email.com"
                            required
                        />
                        {fieldErrors.email && (
                            <p className="login-error">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">Contraseña</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setFieldErrors(prev => ({
                                    ...prev,
                                    password: undefined
                                }));
                            }} 
                            minLength={8}
                            maxLength={72}
                            placeholder="Mínimo 8 caracteres"
                            required
                        />
                        {fieldErrors.password && (
                            <p className="login-error">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-submit"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Registrando..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}