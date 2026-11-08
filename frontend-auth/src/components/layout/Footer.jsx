import React from "react";
import "../../styles/Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="global-footer">
            <div className="footer-content">

                <div className="footer-logo">
                    <span className="logo-text">ReservaYa</span>
                </div>

                <div className="footer-info">
                    <p>
                        &copy; {currentYear} reservaYa.
                        Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
