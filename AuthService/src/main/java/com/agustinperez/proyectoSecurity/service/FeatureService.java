
package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Feature;
import com.agustinperez.proyectoSecurity.repository.FeatureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeatureService {

    private final FeatureRepository featureRepository;

    public FeatureService(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    public Feature getFeatureById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "La característica no existe."
                        )
                );
    }

    public Feature saveFeature(Feature feature) {

        if (feature.getName() == null ||
                feature.getName().isBlank()) {
            throw new RuntimeException(
                    "El nombre es obligatorio."
            );
        }

        if (feature.getIcon() == null ||
                feature.getIcon().isBlank()) {
            throw new RuntimeException(
                    "El ícono es obligatorio."
            );
        }

        if (featureRepository.existsByNameIgnoreCase(
                feature.getName().trim())) {
            throw new RuntimeException(
                    "Ya existe una característica con ese nombre."
            );
        }

        feature.setName(feature.getName().trim());

        return featureRepository.save(feature);
    }

    public Feature updateFeature(Long id, Feature data) {

        Feature feature = getFeatureById(id);

        if (data.getName() == null ||
                data.getName().isBlank()) {
            throw new RuntimeException(
                    "El nombre es obligatorio."
            );
        }

        if (data.getIcon() == null ||
                data.getIcon().isBlank()) {
            throw new RuntimeException(
                    "El ícono es obligatorio."
            );
        }

        boolean duplicated = featureRepository
                .existsByNameIgnoreCase(data.getName().trim());

        if (duplicated &&
                !feature.getName().equalsIgnoreCase(
                        data.getName().trim())) {
            throw new RuntimeException(
                    "Ya existe una característica con ese nombre."
            );
        }

        feature.setName(data.getName().trim());
        feature.setIcon(data.getIcon());

        return featureRepository.save(feature);
    }

    @Transactional
    public void deleteFeature(Long id) {

        Feature feature = getFeatureById(id);

        featureRepository.deleteAssociationsByFeatureId(id);

        featureRepository.delete(feature);
    }
}
