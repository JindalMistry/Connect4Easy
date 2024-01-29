package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.ConnectionGames;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnGamesRepository extends JpaRepository<ConnectionGames, Long> {

}
