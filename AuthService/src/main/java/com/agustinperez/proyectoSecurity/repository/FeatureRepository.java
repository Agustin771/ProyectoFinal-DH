
package com.agustinperez.proyectoSecurity.repository;

import com.agustinperez.proyectoSecurity.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureRepository
        extends JpaRepository<Feature, Long> {

    boolean existsByNameIgnoreCase(String name);

    @Modifying
    @Query(value = """
        DELETE FROM product_features
        WHERE feature_id = :featureId
        """, nativeQuery = true)
    void deleteAssociationsByFeatureId(
            @Param("featureId") Long featureId
    );
}
