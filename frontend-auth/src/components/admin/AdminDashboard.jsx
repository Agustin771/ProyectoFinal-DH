import React from 'react';
import ProductForm from '../home/ProductForm';
import CategoryForm from './CategoryForm';
import '../../styles/AdminDashboard.css';
import { Link } from 'react-router-dom';
import CategoryList from './CategoryList';

export default function AdminDashboard() {
    return (
        <main className="admin-dashboard">

            <header className="admin-header">
                <div className="admin-header-content">

                    <span className="admin-eyebrow">
                        ADMINISTRACIÓN
                    </span>

                    <h1>Panel de administración</h1>

                    <p>
                        Gestioná los productos y categorías de tu tienda
                        desde un solo lugar.
                    </p>

                    <Link
                        to="/admin/productos"
                        className="admin-products-button"
                    >
                        📋 Lista de productos
                    </Link>

                    <Link
                        to="/admin/caracteristicas"
                        className="admin-products-button"
                    >
                        ✨ Administrar características
                    </Link>
                </div>

                <Link to="/" className="admin-back-button">
                    ← Volver a la tienda
                </Link>
            </header>

            <section className="admin-container">

                <div className="admin-form-wrapper">
                    <div className="admin-section-heading">
                        <div className="admin-icon">📦</div>
                        <div>
                            <h2>Productos</h2>
                            <p>Agregá nuevos productos a tu tienda.</p>
                        </div>
                    </div>

                    <ProductForm />
                </div>

                <div className="admin-form-wrapper">
                    <div className="admin-section-heading">
                        <div className="admin-icon">🏷️</div>
                        <div>
                            <h2>Categorías</h2>
                            <p>Organizá tus productos por categoría.</p>
                        </div>
                    </div>

                    <CategoryForm />
                    <CategoryList />
                </div>

            </section>
        </main>
    );
}
