package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Category;
import com.agustinperez.proyectoSecurity.model.Product;
import com.agustinperez.proyectoSecurity.repository.CategoryRepository;
import com.agustinperez.proyectoSecurity.repository.FeatureRepository;
import com.agustinperez.proyectoSecurity.repository.ProductRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private FeatureRepository featureRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void noDebeGuardarProductoSinCategoria() {

        Product product = new Product();
        product.setName("Hotel Demo");

        when(productRepository.existsByName("Hotel Demo"))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.saveProduct(product)
        );

        assertEquals(
                "Debés seleccionar una categoría.",
                exception.getMessage()
        );

        verify(productRepository, never()).save(any());
    }

    @Test
    void debeGuardarProductoConCategoria() {

        Category category = new Category(
                "Hoteles",
                "Categoría de hoteles",
                "https://example.com/hotel.jpg"
        );

        category.setId(1L);

        Product product = new Product(
                "Hotel Demo",
                "Descripción del hotel",
                List.of("https://example.com/hotel.jpg"),
                category
        );

        when(productRepository.existsByName("Hotel Demo"))
                .thenReturn(false);

        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Product resultado = productService.saveProduct(product);

        assertNotNull(resultado);
        assertEquals("Hotel Demo", resultado.getName());
        assertEquals("Hoteles", resultado.getCategory().getTitle());

        verify(productRepository).save(any(Product.class));
    }

    @Test
    void noDebeGuardarProductoDuplicado() {

        Product product = new Product();
        product.setName("Hotel Demo");

        when(productRepository.existsByName("Hotel Demo"))
                .thenReturn(true);

        assertThrows(
                RuntimeException.class,
                () -> productService.saveProduct(product)
        );

        verify(productRepository, never()).save(any());
    }
}
