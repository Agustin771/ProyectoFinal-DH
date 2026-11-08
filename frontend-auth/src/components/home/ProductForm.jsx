import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/categoryService';
import { getAllFeatures } from '../../services/featureService';
import { useAuth } from '../context/AuthContext';
import {
    createProduct,
    updateProduct
} from '../../services/productService';

export default function ProductForm({
    onProductCreated,
    product = null,
    onCancel
}) {

    const { apiFetch } = useAuth();

    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);

    const [selectedFeatures, setSelectedFeatures] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: ''
    });

    const [imageInput, setImageInput] = useState('');
    const [images, setImages] = useState([]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFeatures, setLoadingFeatures] = useState(true);

    
    useEffect(() => {

        if (!product) {
            setFormData({
                name: '',
                description: '',
                categoryId: ''
            });

            setImages([]);
            setImageInput('');
            setSelectedFeatures([]);
            return;
        }

        setFormData({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.category?.id
            ? String(product.category.id)
            : ''
        });

        setImages(
            Array.isArray(product.images) ? product.images : []
        );

        setSelectedFeatures(
            Array.isArray(product.features)
                ? product.features.map(feature => Number(feature.id))
                : []
        );

        setError('');
        setSuccess('');

    }, [product]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Error al cargar las categorías');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();

    }, []);


    useEffect(() => {

        const fetchFeatures = async () => {
            try {
                const data = await getAllFeatures(apiFetch);

                setFeatures(Array.isArray(data) ? data : []);

            } catch (err) {
                setError(
                    err.message || 'Error al cargar las características'
                );
            } finally {
                setLoadingFeatures(false);
            }
        };

        fetchFeatures();

    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFeatureChange = (featureId) => {

        const id = Number(featureId);

        setSelectedFeatures((previous) => {

            if (previous.includes(id)) {
                return previous.filter(item => item !== id);
            }

            return [...previous, id];
        });

    };

    const handleAddImage = () => {

        setError('');

        const url = imageInput.trim();

        if (!url) {
            setError('Ingresá una URL de imagen.');
            return;
        }

        try {
            const parsedUrl = new URL(url);

            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error();
            }

        } catch {
            setError('Ingresá una URL válida (http o https).');
            return;
        }

        if (images.includes(url)) {
            setError('Esta imagen ya fue agregada.');
            return;
        }

        setImages(previous => [...previous, url]);
        setImageInput('');
    };

    const handleRemoveImage = (index) => {
        setImages(previous =>
            previous.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');

        if (!formData.categoryId) {
            setError('Tenés que seleccionar una categoría.');
            return;
        }

        if (images.length === 0) {
            setError('Tenés que agregar al menos una imagen.');
            return;
        }

        setLoading(true);

        try {

            const productPayload = {

                name: formData.name,
                description: formData.description,
                images: images,

                category: {
                    id: Number(formData.categoryId)
                },

                features: selectedFeatures.map(id => ({
                    id: Number(id)
                }))

            };

            if (product) {

                await updateProduct(
                    product.id,
                    productPayload,
                    apiFetch
                );

                setSuccess('¡Producto actualizado correctamente!');

            } else {

                await createProduct(
                    productPayload,
                    apiFetch
                );

                setSuccess('¡Producto creado correctamente!');

                setFormData({
                    name: '',
                    description: '',
                    categoryId: ''
                });

                setImageInput('');
                setImages([]);
                setSelectedFeatures([]);

            }

            if (onProductCreated) {
                onProductCreated();
            }

        } catch (err) {

            setError(err.message || 'Error al guardar el producto');

        } finally {

            setLoading(false);

        }

    };

    return (

        <section className="admin-form-card">

            <form onSubmit={handleSubmit}>

                {error && (
                    <div className="admin-message error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="admin-message success-message">
                        {success}
                    </div>
                )}

                <div className="admin-form-group">

                    <label htmlFor="product-name">
                        Nombre del producto
                    </label>

                    <input
                        id="product-name"
                        type="text"
                        name="name"
                        placeholder="Ej: Hotel Centro"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="admin-form-group">

                    <label htmlFor="product-description">
                        Descripción
                    </label>

                    <textarea
                        id="product-description"
                        name="description"
                        placeholder="Describí las características del alojamiento..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                    />

                </div>

                <div className="admin-form-group">

                    <label htmlFor="product-category">
                        Categoría del alojamiento
                    </label>

                    <select
                        id="product-category"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        disabled={
                            loadingCategories ||
                            categories.length === 0
                        }
                    >

                        <option value="">
                            {loadingCategories
                                ? 'Cargando categorías...'
                                : categories.length === 0
                                    ? 'No hay categorías disponibles'
                                    : 'Seleccioná una categoría'
                            }
                        </option>

                        {categories.map((category) => (

                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.title}
                            </option>

                        ))}

                    </select>

                    <small>
                        Seleccioná a qué tipo de alojamiento pertenece.
                    </small>

                </div>

                <div className="admin-form-group">

                    <label>
                        Características del alojamiento
                    </label>

                    <small>
                        Podés seleccionar una o varias características.
                    </small>

                    {loadingFeatures ? (

                        <p>Cargando características...</p>

                    ) : features.length === 0 ? (

                        <p>
                            No hay características registradas.
                            Primero agregá características desde
                            Administración.
                        </p>

                    ) : (

                        <div className="features-selection">

                            {features.map((feature) => (

                                <label
                                    key={feature.id}
                                    className={`feature-checkbox ${
                                        selectedFeatures.includes(Number(feature.id))
                                            ? 'selected'
                                            : ''
                                    }`}
                                >

                                    <input
                                        type="checkbox"
                                        checked={selectedFeatures.includes(Number(feature.id))}
                                        onChange={() =>
                                            handleFeatureChange(feature.id)
                                        }
                                    />

                                    <span className="feature-icon">
                                        {feature.icon}
                                    </span>

                                    <span className="feature-name">
                                        {feature.name}
                                    </span>

                                </label>

                            ))}

                        </div>
                    )}

                    <small>
                        Características seleccionadas: {selectedFeatures.length}
                    </small>

                </div>

                <div className="admin-form-group">
                    <label htmlFor="product-image">
                        Galería de imágenes
                    </label>
                <div className="image-input-row">
                    <input
                        id="product-image"
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImage();
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="add-image-button"
                        onClick={handleAddImage}
                    >
                        + Agregar
                    </button>
                </div>
                    <small>
                        Podés agregar todas las imágenes que quieras,
                        ingresando una URL por vez.
                    </small>
                    {images.length > 0 && (
                        <div className="product-images-preview">
                            <div className="images-preview-heading">
                                <strong>Imágenes agregadas</strong>
                                <span>{images.length} imagen(es)</span>
                            </div>
                            <div className="product-images-grid">
                                {images.map((image, index) => (
                                    <div
                                        className="product-image-item"
                                        key={`${image}-${index}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Imagen ${index + 1}`}
                                            onError={(e) => {
                                                e.currentTarget.style.opacity = '0.3';
                                            }}
                                        />

                                        <span className="image-number">
                                            {index + 1}
                                        </span>

                                        <button
                                            type="button"
                                            className="remove-image-button"
                                            onClick={() => handleRemoveImage(index)}
                                            aria-label={`Eliminar imagen ${index + 1}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="admin-submit-button"
                    disabled={
                        loading ||
                        loadingCategories ||
                        categories.length === 0 ||
                        loadingFeatures
                    }
                >
                    {loading
                        ? 'Guardando...'
                        : product
                            ? 'Guardar cambios'
                            : '+ Crear producto'
                    }
                </button>
            </form>

        </section>
    );
}
