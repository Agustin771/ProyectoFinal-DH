import { useState } from "react";
import {
    verifyAccount,
    resendVerification
} from "../../services/authService";

export default function VerificationModal({
    email,
    onClose,
    onVerified
}) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleVerify(event) {
        event.preventDefault();

        setError("");
        setMessage("");
        setSubmitting(true);

        try {
            await verifyAccount(email, code);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleResend() {
        setError("");
        setMessage("");
        setSubmitting(true);

        try {
            const data = await resendVerification(email);
            setMessage(data.message || "Solicitud procesada. Revisá tu correo.");
        } catch (err) {
            setError(err.message);
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
                aria-labelledby="verification-title"
            >
                <button
                    className="modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ×
                </button>

                {success ? (
                    <>
                        <h2 id="verification-title">
                            ¡Cuenta verificada!
                        </h2>

                        <p className="modal-description">
                            Tu cuenta fue activada correctamente.
                            Ya podés iniciar sesión.
                        </p>

                        <button
                            className="login-submit"
                            type="button"
                            onClick={onVerified}
                        >
                            ¡Entendido!
                        </button>
                    </>
                ) : (
                    <>
                        <h2 id="verification-title">
                            Verificá tu email
                        </h2>

                        <p className="modal-description">
                            Ingresá el código de seis dígitos que enviamos a{" "}
                            <strong>{email}</strong>.
                            Revisá también la carpeta de spam.
                        </p>

                        <form onSubmit={handleVerify}>
                            <div className="form-group">
                                <label htmlFor="verification-code">
                                    Código de verificación
                                </label>

                                <input
                                    id="verification-code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    value={code}
                                    onChange={(event) =>
                                        setCode(
                                            event.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="123456"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="login-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="modal-description" role="status">
                                    {message}
                                </p>
                            )}

                            <button
                                className="login-submit"
                                type="submit"
                                disabled={submitting || code.length !== 6}
                            >
                                {submitting ? "Verificando..." : "Verificar cuenta"}
                            </button>
                        </form>

                        <button
                            className="login-submit"
                            type="button"
                            onClick={handleResend}
                            disabled={submitting}
                            style={{ marginTop: "12px" }}
                        >
                            {submitting ? "Procesando..." : "Reenviar código"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}