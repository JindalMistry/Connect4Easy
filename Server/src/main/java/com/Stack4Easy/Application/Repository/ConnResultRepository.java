package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.ConnectionResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConnResultRepository extends JpaRepository<ConnectionResults, Long> {
}
