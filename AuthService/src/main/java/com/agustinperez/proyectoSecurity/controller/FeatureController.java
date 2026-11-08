package com.agustinperez.proyectoSecurity.controller;

import com.agustinperez.proyectoSecurity.model.Feature;
import com.agustinperez.proyectoSecurity.service.FeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        return ResponseEntity.ok(
                featureService.getAllFeatures()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeatureById(
            @PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    featureService.getFeatureById(id)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createFeature(
            @RequestBody Feature feature) {
        try {
            return ResponseEntity.ok(
                    featureService.saveFeature(feature)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeature(
            @PathVariable Long id,
            @RequestBody Feature feature) {
        try {
            return ResponseEntity.ok(
                    featureService.updateFeature(id, feature)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeature(
            @PathVariable Long id) {
        try {
            featureService.deleteFeature(id);
            return ResponseEntity.ok(
                    "Característica eliminada correctamente."
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
