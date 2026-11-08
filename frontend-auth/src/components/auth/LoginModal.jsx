import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    resendVerification,
    forgotPassword,
    resetPassword
} from "../../services/authService";

export default function LoginModal({
    onClose,
    onVerificationRequested
}) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    // Recuperación de contraseña
    const [recoveryStep, setRecoveryStep] = useState("login");
    const [recoveryCode, setRecoveryCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    function clearMessages() {
        setError("");
        setSuccess("");
        setResendMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        clearMessages();
        setNeedsVerification(false);
        setSubmitting(true);

        try {
            await login(email, password);
            onClose();
        } catch (err) {
            if (
                err.message ===
                "Antes de iniciar sesión, tenés que verificar tu correo electrónico."
            ) {
                setNeedsVerification(true);
            } else {
                setError(err.message);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleResend() {
        clearMessages();
        setSubmitting(true);

        try {
            const data = await resendVerification(email);

            setResendMessage(
                data.message || "Revisá tu correo electrónico."
            );

            onVerificationRequested(email);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleForgotPassword(event) {
        event.preventDefault();

        clearMessages();
        setSubmitting(true);

        try {
            const data = await forgotPassword(email);

            setSuccess(
                data.message ||
                "Si la cuenta existe, recibirás un código de recuperación."
            );

            setRecoveryStep("reset");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleResetPassword(event) {
        event.preventDefault();

        clearMessages();

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (!/^\d{6}$/.test(recoveryCode)) {
            setError("El código debe tener exactamente 6 dígitos.");
            return;
        }

        setSubmitting(true);

        try {
            const data = await resetPassword(
                email,
                recoveryCode,
                newPassword
            );

            setSuccess(
                data.message || "¡Contraseña actualizada correctamente!"
            );

            setRecoveryStep("success");
            setPassword("");
            setRecoveryCode("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function backToLogin() {
        clearMessages();
        setRecoveryStep("login");
        setRecoveryCode("");
        setNewPassword("");
        setConfirmPassword("");
        setNeedsVerification(false);
    }

    return (
        <div className="modal-overlay">
            <div
                className="login-modal"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-title"
            >
                <button
                    className="modal-close"
                    onClick={onClose}
                    type="button"
                    aria-label="Cerrar"
                >
                    ×
                </button>

                {recoveryStep === "login" && !needsVerification && (
                    <>
                        <h2 id="login-title">¡Qué bueno verte!</h2>

                        <p className="modal-description">
                            Iniciá sesión para continuar.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email</label>

                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="login-password">
                                    Contraseña
                                </label>

                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Tu contraseña"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                className="recovery-link"
                                onClick={() => {
                                    clearMessages();
                                    setRecoveryStep("request");
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>

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
                                {submitting
                                    ? "Ingresando..."
                                    : "Iniciar sesión"}
                            </button>
                        </form>
                    </>
                )}

                {recoveryStep === "login" && needsVerification && (
                    <div className="verification-required">
                        <div className="verification-icon">
                            <span>✉</span>
                        </div>

                        <h2 className="verification-title">
                            ¡Un último paso!
                        </h2>

                        <p className="verification-description">
                            Tu cuenta todavía no está verificada.
                            Necesitamos confirmar que el email te pertenece.
                        </p>

                        <div className="verification-email">
                            {email}
                        </div>

                        {error && (
                            <p className="verification-error" role="alert">
                                {error}
                            </p>
                        )}

                        {resendMessage && (
                            <p className="verification-notice" role="status">
                                {resendMessage}
                            </p>
                        )}

                        <div className="verification-actions">
                            <button
                                className="verification-primary"
                                type="button"
                                onClick={() =>
                                    onVerificationRequested(email)
                                }
                            >
                                Verificar mi cuenta
                            </button>

                            <button
                                className="verification-secondary"
                                type="button"
                                onClick={handleResend}
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Enviando..."
                                    : "Reenviar código"}
                            </button>
                        </div>

                        <button
                            type="button"
                            className="verification-back"
                            onClick={backToLogin}
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                )}

                {recoveryStep === "request" && (
                    <>
                        <h2>Recuperar contraseña</h2>

                        <p className="modal-description">
                            Ingresá el email de tu cuenta y te enviaremos
                            un código de recuperación de 6 dígitos.
                        </p>

                        <form onSubmit={handleForgotPassword}>
                            <div className="form-group">
                                <label htmlFor="recovery-email">
                                    Email de tu cuenta
                                </label>

                                <input
                                    id="recovery-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="login-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="recovery-success" role="status">
                                    {success}
                                </p>
                            )}

                            <button
                                className="login-submit"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Enviando..."
                                    : "Enviar código"}
                            </button>
                        </form>

                        <button
                            type="button"
                            className="verification-back"
                            onClick={backToLogin}
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </>
                )}

                {recoveryStep === "reset" && (
                    <>
                        <h2>Nueva contraseña</h2>

                        <p className="modal-description">
                            Revisá tu correo e ingresá el código de 6 dígitos.
                            Después elegí tu nueva contraseña.
                        </p>

                        <div className="verification-email">
                            {email}
                        </div>

                        {success && (
                            <p className="recovery-success" role="status">
                                {success}
                            </p>
                        )}

                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label htmlFor="recovery-code">
                                    Código de recuperación
                                </label>

                                <input
                                    id="recovery-code"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={recoveryCode}
                                    onChange={(event) =>
                                        setRecoveryCode(
                                            event.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="123456"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-password">
                                    Nueva contraseña
                                </label>

                                <input
                                    id="new-password"
                                    type="password"
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">
                                    Confirmar contraseña
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    minLength={8}
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Repetí la contraseña"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="login-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="recovery-success" role="status">
                                    {success}
                                </p>
                            )}

                            <button
                                className="login-submit"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Actualizando..."
                                    : "Cambiar contraseña"}
                            </button>
                        </form>

                        <button
                            type="button"
                            className="verification-back"
                            onClick={backToLogin}
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </>
                )}

                {recoveryStep === "success" && (
                    <div className="verification-required">
                        <div className="verification-icon">
                            <span>✓</span>
                        </div>

                        <h2 className="verification-title">
                            ¡Contraseña actualizada!
                        </h2>

                        <p className="verification-description">
                            Ya podés ingresar a ReservaYa con tu nueva
                            contraseña.
                        </p>

                        <button
                            className="login-submit"
                            type="button"
                            onClick={backToLogin}
                        >
                            Ir al inicio de sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}