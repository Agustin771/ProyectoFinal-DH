package com.agustinperez.proyectoSecurity.config;

import com.agustinperez.proyectoSecurity.model.*;
import com.agustinperez.proyectoSecurity.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@demo.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin1234!}")
    private String adminPassword;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            FeatureRepository featureRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {

        Role userRole = roleRepository.findByNameRole(ERole.ROLE_USER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setNameRole(ERole.ROLE_USER);
                    return roleRepository.save(role);
                });

        Role adminRole = roleRepository.findByNameRole(ERole.ROLE_ADMIN)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setNameRole(ERole.ROLE_ADMIN);
                    return roleRepository.save(role);
                });

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = new User();

            admin.setName("Administrador");
            admin.setLastName("Demo");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
        }

        Category hoteles = createCategory(
                "Hoteles",
                "Hoteles para disfrutar de una estadía inolvidable.",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945"
        );

        Category cabanas = createCategory(
                "Cabañas",
                "Cabañas rodeadas de naturaleza y tranquilidad.",
                "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8"
        );

        Category departamentos = createCategory(
                "Departamentos",
                "Departamentos cómodos para tus próximas vacaciones.",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"
        );

        Feature wifi = createFeature("WiFi", "📶");
        Feature piscina = createFeature("Piscina", "🏊");
        Feature desayuno = createFeature("Desayuno incluido", "☕");
        Feature estacionamiento = createFeature("Estacionamiento", "🚗");
        Feature aire = createFeature("Aire acondicionado", "❄️");
        Feature petFriendly = createFeature("Pet Friendly", "🐶");

        createProduct(
                "Hotel Paraíso",
                "Un hermoso hotel con piscina y desayuno incluido. Ideal para descansar.",
                hoteles,
                List.of(
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
                ),
                List.of(wifi, piscina, desayuno, aire)
        );

        createProduct(
                "Cabaña Los Pinos",
                "Una acogedora cabaña rodeada de árboles y naturaleza.",
                cabanas,
                List.of(
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQcnvW9Dw2QWz0RyNFDAmzTahuSWLG5z6hcNNb1o2osMzF5WXcmLHnxc&s=10",
                        "https://images.unsplash.com/photo-1510798831971-661eb04b3739"
                ),
                List.of(wifi, estacionamiento, petFriendly)
        );

        createProduct(
                "Departamento Centro",
                "Departamento moderno, cómodo y ubicado cerca de todo.",
                departamentos,
                List.of(
                        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
                ),
                List.of(wifi, aire, estacionamiento)
        );

        createProduct(
                "Hotel Vista al Mar",
                "Disfrutá de una estadía especial con excelentes instalaciones.",
                hoteles,
                List.of(
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
                        "https://images.unsplash.com/photo-1582719508461-905c673771fd"
                ),
                List.of(wifi, piscina, desayuno, estacionamiento)
        );

        System.out.println("==================================");
        System.out.println(" DATOS DE DEMOSTRACIÓN INICIADOS");
        System.out.println(" Administrador: " + adminEmail);
        System.out.println(" Categorías: 3");
        System.out.println(" Características: 6");
        System.out.println(" Productos de ejemplo: 4");
        System.out.println("==================================");
    }

    private Category createCategory(
            String title,
            String description,
            String imageUrl
    ) {
        return categoryRepository.findByTitle(title)
                .orElseGet(() -> categoryRepository.save(
                        new Category(title, description, imageUrl)
                ));
    }

    private Feature createFeature(String name, String icon) {

        return featureRepository.findAll().stream()
                .filter(feature ->
                        feature.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> featureRepository.save(
                        new Feature(name, icon)
                ));
    }

    private void createProduct(
            String name,
            String description,
            Category category,
            List<String> images,
            List<Feature> features
    ) {

        if (productRepository.existsByName(name)) {
            return;
        }

        Product product = new Product(
                name,
                description,
                images,
                category
        );

        product.setFeatures(features);

        productRepository.save(product);
    }
}
