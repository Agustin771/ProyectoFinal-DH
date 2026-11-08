import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductForm from '../home/ProductForm';

import { useAuth } from '../context/AuthContext';

import '../../styles/ProductList.css';

export default function ProductList() {

    const { apiFetch } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const editSectionRef = useRef(null);
    const loadProducts = async () => {

        try {
            setLoading(true);
            setError('');
            const response = await apiFetch('/api/products');
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    errorData || 'Error al obtener los productos'
                );
            }
            const data = await response.json();

            setProducts(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError(
                error.message || 'Error al cargar los productos'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
    if (editingProduct && editSectionRef.current) {
        editSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    }, [editingProduct]);

    const handleProductSaved = async () => {

        setEditingProduct(null);

        await loadProducts();

        setMessage('¡Producto actualizado correctamente!');

    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.'
        );

        if (!confirmed) return;

        try {

            setDeletingId(id);
            setError('');
            setMessage('');

            const response = await apiFetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.text();
                let errorMessage = errorData;
                try {
                    const parsedError = JSON.parse(errorData);
                    errorMessage = parsedError.message || errorData;
                } catch {
                    // Respuesta no JSON
                }
                throw new Error(
                    errorMessage || 'No se pudo eliminar el producto'
                );
            }
            setProducts(prev =>
                prev.filter(product => product.id !== id)
            );
            setMessage('Producto eliminado correctamente.');
        } catch (error) {
            console.error('Error al eliminar:', error);
            setError(
                error.message || 'No se pudo eliminar el producto'
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="product-list-page">
            <header className="product-list-header">
                <div>

                    <span className="admin-eyebrow">
                        ADMINISTRACIÓN
                    </span>

                    <h1>Lista de productos</h1>

                    <p>
                        Gestioná y administrá los productos de tu tienda.
                    </p>

                </div>

                <Link
                    to="/admin"
                    className="product-list-back"
                >
                    ← Volver al panel
                </Link>

            </header>

            <section className="product-list-container">

                <div className="product-list-card">

                    <div className="product-list-card-header">

                        <div>

                            <h2>Productos disponibles</h2>

                            <p>
                                Total de productos: {products.length}
                            </p>

                        </div>

                    </div>

                    {message && (
                        <div className="product-list-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="product-list-error">
                            {error}
                        </div>
                    )}
                    {editingProduct && (
                        <div
                            className="product-edit-section"
                            ref={editSectionRef}
                        >
                            <div className="product-edit-heading">

                                <h2>
                                    Editando: {editingProduct.name}
                                </h2>

                                <p>
                                    Modificá los datos del alojamiento y guardá los cambios.
                                </p>

                            </div>

                            <ProductForm
                                product={editingProduct}
                                onProductCreated={handleProductSaved}
                                onCancel={() => setEditingProduct(null)}
                            />

                        </div>

                    )}

                    {loading ? (

                        <p className="product-list-status">
                            Cargando productos...
                        </p>

                    ) : products.length === 0 ? (

                        <p className="product-list-status">
                            No hay productos disponibles.
                        </p>

                    ) : (

                        <div className="product-table-wrapper">

                            <table className="product-table">

                                <thead>

                                    <tr>
                                        <th>Id</th>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {products.map(product => (

                                        <tr key={product.id}>

                                            <td>
                                                {product.id}
                                            </td>

                                            <td>
                                                {product.name}
                                            </td>

                                            <td className="product-actions">

                                                <button
                                                    type="button"
                                                    className="edit-product-button"
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setMessage('');
                                                        setError('');
                                                    }}
                                                    disabled={deletingId !== null}
                                                >
                                                    ✏️ Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-product-button"
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    disabled={deletingId !== null}
                                                >
                                                    {deletingId === product.id
                                                        ? 'Eliminando...'
                                                        : 'Eliminar producto'}
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>
            </section>
        </main>
    );
}
