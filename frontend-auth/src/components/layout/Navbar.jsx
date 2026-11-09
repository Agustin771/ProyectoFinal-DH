import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
    onLoginClick,
    onRegisterClick
}) {
    const { isAuthenticated, logout, user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">

            <Link
                to="/"
                className="navbar-brand"
                onClick={closeMenu}
            >
                <div className="navbar-logo">
                    <span className="logo-icon">✦</span>
                    <span>
                        Reserva<span className="logo-highlight">Ya</span>
                    </span>
                </div>

                <span className="navbar-slogan">
                    Tu próximo destino empieza acá
                </span>
            </Link>

            {isAuthenticated && (
                <span className="navbar-greeting">
                    ¡Qué bueno verte, {user
                        ? `${user.name} ${user.lastName}`
                        : "de nuevo"}! ✨
                </span>
            )}

            <button
                type="button"
                className={`navbar-toggle ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="navbar-actions"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav
                id="navbar-actions"
                className={`navbar-actions ${menuOpen ? "menu-open" : ""}`}
            >
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/favoritos"
                            className="navbar-button navbar-favorites"
                            onClick={closeMenu}
                        >
                            ♡ Mis favoritos
                        </Link>

                        <Link
                            to="/mis-reservas"
                            className="navbar-button"
                            onClick={closeMenu}
                        >
                            Mis reservas
                        </Link>

                        <button
                            type="button"
                            className="navbar-button"
                            onClick={() => {
                                closeMenu();
                                logout();
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="navbar-button navbar-register"
                            onClick={() => {
                                closeMenu();
                                onRegisterClick();
                            }}
                        >
                            Crear cuenta
                        </button>

                        <button
                            type="button"
                            className="navbar-button navbar-login"
                            onClick={() => {
                                closeMenu();
                                onLoginClick();
                            }}
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}