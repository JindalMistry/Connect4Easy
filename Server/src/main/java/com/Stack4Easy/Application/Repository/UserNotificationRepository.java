package com.Stack4Easy.Application.Repository;

import com.Stack4Easy.Application.Entity.UserNotification;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findAllByUsernameOrderByTimestampDesc(String username);
}
