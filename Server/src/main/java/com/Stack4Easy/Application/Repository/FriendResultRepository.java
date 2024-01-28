package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.Friends_Results;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendResultRepository extends JpaRepository<Friends_Results, Long> {

}
