package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Category;
import com.agustinperez.proyectoSecurity.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category saveCategory(Category category) {
        Optional<Category> existingCategory = categoryRepository.findByTitle(category.getTitle());
        if (existingCategory.isPresent()) {
            throw new RuntimeException("Ya existe una categoría con ese título.");
        }
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("La categoría no existe.");
        }
        categoryRepository.deleteById(id);
    }
}