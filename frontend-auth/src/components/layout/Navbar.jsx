import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
    onLoginClick,
    onRegisterClick
}) {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <header className="navbar">

            <Link to="/" className="navbar-brand">

                <div className="navbar-brand">
                    <div className="navbar-logo">
                        <span className="logo-icon">✦</span>
                        <span>Reserva<span className="logo-highlight">Ya</span></span>
                    </div>

                    <span className="navbar-slogan">
                        Tu próximo destino empieza acá
                    </span>
                </div>

            </Link>

            {isAuthenticated && (
                
                <span className="navbar-greeting">
                    ¡Qué bueno verte, {user
                        ? `${user.name} ${user.lastName}`
                        : "de nuevo"}! ✨
                </span>
            )}

            <nav className="navbar-actions">

                {isAuthenticated ? (
                    <>
                        <Link
                            to="/favoritos"
                            className="navbar-button navbar-favorites"
                        >
                            ♡ Mis favoritos
                        </Link>

                        <Link
                            to="/mis-reservas"
                            className="navbar-button"
                        >
                            Mis reservas
                        </Link>

                        <button
                            type="button"
                            className="navbar-button"
                            onClick={logout}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="navbar-button navbar-register"
                            onClick={onRegisterClick}
                        >
                            Crear cuenta
                        </button>

                        <button
                            type="button"
                            className="navbar-button navbar-login"
                            onClick={onLoginClick}
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}
