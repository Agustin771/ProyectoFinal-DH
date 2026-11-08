import { Routes, Route, Navigate } from "react-router-dom";

import FeatureList from "../components/admin/FeatureList";
import MainLayout from "../layouts/MainLayout";
import MyReservations from "../pages/MyReservations";
import Home from "../pages/Home";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../components/admin/AdminDashboard";
import ProductList from "../components/admin/ProductList";

import { useAuth } from "../components/context/AuthContext";

function AdminRoute({ children }) {

    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <p className="loading">Comprobando permisos...</p>;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function AppRouter() {

    return (
        <Routes>

            <Route path="/" element={<MainLayout />}>

                <Route index element={<Home />} />

                <Route
                    path="favoritos"
                    element={<Favorites />}
                />
                
                <Route
                    path="mis-reservas"
                    element={<MyReservations />}
                />

                <Route
                    path="admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="admin/caracteristicas"
                    element={
                        <AdminRoute>
                            <FeatureList />
                        </AdminRoute>
                    }
                />

                <Route
                    path="admin/productos"
                    element={
                        <AdminRoute>
                            <ProductList />
                        </AdminRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />

            </Route>

        </Routes>
    );
}
