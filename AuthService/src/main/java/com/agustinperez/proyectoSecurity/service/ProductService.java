package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Category;
import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.repository.CategoryRepository;
import com.agustinperez.proyectoSecurity.repository.FeatureRepository;
import com.agustinperez.proyectoSecurity.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.agustinperez.proyectoSecurity.model.Feature;
import java.util.ArrayList;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {


    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            FeatureRepository featureRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
    }

    private List<Feature> resolveFeatures(Product product) {

        if (product.getFeatures() == null) {
            return new ArrayList<>();
        }

        return product.getFeatures().stream()
                .map(feature -> {
                    if (feature.getId() == null) {
                        throw new RuntimeException(
                                "Todas las características deben tener un ID."
                        );
                    }

                    return featureRepository.findById(feature.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Una característica seleccionada no existe."
                                    )
                            );
                })
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public Page<Product> getProductsPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    public List<Product> getRandomProducts() {
        return productRepository.findRandomProducts(10);
    }
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    public Product saveProduct(Product product) {

        if (productRepository.existsByName(product.getName())) {
            throw new RuntimeException(
                    "Ya existe un producto con ese nombre."
            );
        }

        if (product.getCategory() == null ||
                product.getCategory().getId() == null) {

            throw new RuntimeException(
                    "Debés seleccionar una categoría."
            );
        }

        Long categoryId = product.getCategory().getId();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("La categoría seleccionada no existe.")
                );

        product.setCategory(category);

        product.setFeatures(resolveFeatures(product));

        return productRepository.save(product);
    }
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
    public Product updateProduct(Long id, Product data) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("El producto no existe.")
                );

        if (data.getName() == null || data.getName().isBlank()) {
            throw new RuntimeException("El nombre es obligatorio.");
        }

        if (productRepository.existsByNameAndIdNot(
                data.getName(), id)) {
            throw new RuntimeException(
                    "Ya existe otro producto con ese nombre."
            );
        }

        if (data.getCategory() == null ||
                data.getCategory().getId() == null) {
            throw new RuntimeException(
                    "Debés seleccionar una categoría."
            );
        }

        Category category = categoryRepository.findById(
                        data.getCategory().getId())
                .orElseThrow(() ->
                        new RuntimeException("La categoría no existe.")
                );

        existing.setName(data.getName());
        existing.setDescription(data.getDescription());
        existing.setImages(data.getImages());
        existing.setCategory(category);
        existing.setFeatures(resolveFeatures(data));

        return productRepository.save(existing);
    }
}