package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.UserNotification;
import com.Stack4Easy.Application.Repository.UserNotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserNotificationService {
    private final UserNotificationRepository userNotificationRepository;
    public UserNotification pushNotification(UserNotificationDto userNotificationDto) {
        return userNotificationRepository.save(
                new UserNotification(
                        userNotificationDto.getMessage(),
                        userNotificationDto.getUser_id(),
                        userNotificationDto.getUsername(),
                        false,
                        userNotificationDto.getType(),
                        userNotificationDto.getRef_id(),
                        userNotificationDto.getRefname()
                )
        );
    }
    public void pullNotification(UserNotificationDto notificationDto) {
        UserNotification notification = userNotificationRepository.findById(notificationDto.getNotification_id())
                                                                    .orElseThrow();
        userNotificationRepository.deleteById(notification.getNotification_id());
    }
    @Transactional
    public void updateNotification(UserNotificationDto userNotificationDto) {
        UserNotification notification = userNotificationRepository.findById(userNotificationDto.getNotification_id())
                .orElseThrow();
        notification.setIsRead(true);
    }
    public List<UserNotification> getNotificationByUsername(String username) {
        return userNotificationRepository.findAllByUsernameOrderByTimestampDesc(username);
    }
}
