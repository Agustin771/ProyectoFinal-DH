import { useState } from "react";
import { Outlet } from "react-router-dom";

import { FavoritesProvider } from "../components/context/FavoritesContext";
import { useAuth } from "../components/context/AuthContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/layout/WhatsAppButton";

import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";
import VerificationModal from "../components/auth/VerificationModal";
import ProductDetailModal from "../components/products/ProductDetailModal";

export default function MainLayout() {

    const { isAuthenticated, loading } = useAuth();

    const [activeModal, setActiveModal] = useState(null);
    const [pendingVerificationEmail, setPendingVerificationEmail] =
        useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);

    function openVerification(email) {
        setPendingVerificationEmail(email);
        setActiveModal("verification");
    }

    function handleVerified() {
        setPendingVerificationEmail("");
        setActiveModal("login");
    }

    if (loading) {
        return <h2 className="loading">Comprobando sesión...</h2>;
    }

    return (
        <FavoritesProvider>

            <Navbar
                onLoginClick={() => setActiveModal("login")}
                onRegisterClick={() => setActiveModal("register")}
            />

            <main className="main-content">

                <Outlet
                    context={{
                        onProductSelect: setSelectedProduct
                    }}
                />

            </main>

            {!isAuthenticated && activeModal === "login" && (
                <LoginModal
                    onClose={() => setActiveModal(null)}
                    onVerificationRequested={openVerification}
                />
            )}

            {!isAuthenticated && activeModal === "register" && (
                <RegisterModal
                    onClose={() => setActiveModal(null)}
                    onVerificationRequested={openVerification}
                />
            )}

            {!isAuthenticated && activeModal === "verification" && (
                <VerificationModal
                    email={pendingVerificationEmail}
                    onClose={() => setActiveModal(null)}
                    onVerified={handleVerified}
                />
            )}

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onLoginRequired={() => setActiveModal("login")}
                />
            )}

        <WhatsAppButton 
            product={selectedProduct} 
        />   

        <Footer />

        </FavoritesProvider>
    );
}