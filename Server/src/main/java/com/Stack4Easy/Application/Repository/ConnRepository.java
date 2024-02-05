package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.Connections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnRepository extends JpaRepository<Connections, Long> {
    Optional<Connections> findByUsernameAndRefname(String username, String reference_name);
    List<Connections> findAllByUsername(String username);
    List<Connections> findByUsernameAndActiveAndIsRequestAccepted(String username, Boolean active, Boolean IsRequestAccepted);
    List<Connections> findByUsernameAndIsRequestAccepted(String username, Boolean IsRequestAccepted);
    List<Connections> findByRefname(String reference_name);
    void deleteByUsername(String username);

    @Query(value = "select * from Connections where user_id = ?1 and ref_id = ?2", nativeQuery = true)
    List<Connections> findByUserIdAndRefId(Integer user, Integer ref);
}
