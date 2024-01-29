package com.Stack4Easy.Registration.Repository;

import com.Stack4Easy.Registration.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    @Query("select p from User p where p.username like %:str%")
    List<User> getUserBySearch(@Param("str") String search);
    List<User> findByUsernameContainingIgnoreCase(String str);
}
