package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Category;
import com.agustinperez.proyectoSecurity.repository.CategoryRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void debeGuardarCategoriaCorrectamente() {

        Category category = new Category(
                "Hoteles",
                "Hoteles para vacaciones",
                "https://example.com/hotel.jpg"
        );

        when(categoryRepository.findByTitle("Hoteles"))
                .thenReturn(Optional.empty());

        when(categoryRepository.save(category))
                .thenReturn(category);

        Category resultado = categoryService.saveCategory(category);

        assertNotNull(resultado);
        assertEquals("Hoteles", resultado.getTitle());

        verify(categoryRepository).save(category);
    }

    @Test
    void noDebeGuardarCategoriaDuplicada() {

        Category category = new Category(
                "Hoteles",
                "Descripción",
                "https://example.com/hotel.jpg"
        );

        when(categoryRepository.findByTitle("Hoteles"))
                .thenReturn(Optional.of(category));

        assertThrows(
                RuntimeException.class,
                () -> categoryService.saveCategory(category)
        );

        verify(categoryRepository, never()).save(any());
    }
}
