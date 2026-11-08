package com.agustinperez.proyectoSecurity.service;

import com.agustinperez.proyectoSecurity.model.Feature;
import com.agustinperez.proyectoSecurity.repository.FeatureRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeatureServiceTest {

    @Mock
    private FeatureRepository featureRepository;

    @InjectMocks
    private FeatureService featureService;

    @Test
    void debeGuardarCaracteristicaCorrectamente() {

        Feature feature = new Feature("WiFi", "📶");

        when(featureRepository.existsByNameIgnoreCase("WiFi"))
                .thenReturn(false);

        when(featureRepository.save(feature))
                .thenReturn(feature);

        Feature resultado = featureService.saveFeature(feature);

        assertNotNull(resultado);
        assertEquals("WiFi", resultado.getName());

        verify(featureRepository).save(feature);
    }

    @Test
    void noDebeGuardarCaracteristicaSinNombre() {

        Feature feature = new Feature("", "📶");

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> featureService.saveFeature(feature)
        );

        assertEquals(
                "El nombre es obligatorio.",
                exception.getMessage()
        );

        verify(featureRepository, never()).save(any());
    }

    @Test
    void noDebeGuardarCaracteristicaDuplicada() {

        Feature feature = new Feature("WiFi", "📶");

        when(featureRepository.existsByNameIgnoreCase("WiFi"))
                .thenReturn(true);

        assertThrows(
                RuntimeException.class,
                () -> featureService.saveFeature(feature)
        );

        verify(featureRepository, never()).save(any());
    }
}
