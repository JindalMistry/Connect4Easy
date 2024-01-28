package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.Friends_Games;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendGamesRepository extends JpaRepository<Friends_Games, Long> {

}
