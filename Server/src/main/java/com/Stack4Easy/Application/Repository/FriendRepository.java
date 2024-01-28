package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Registration.Entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friends, Long> {
    List<Friends> findAllByUsername(String username);
    List<Friends> findAllByUsernameAndActive(String username, Boolean active);
    List<Friends> findAllByReferencename(String referencename);
}
