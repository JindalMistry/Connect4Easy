package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.UserNotification;
import com.Stack4Easy.Application.Repository.UserNotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserNotificationService {
    private final UserNotificationRepository userNotificationRepository;
    public UserNotification pushNotification(UserNotificationDto userNotificationDto) {
        UserNotification notification = null;
        try{
            notification = userNotificationRepository.save(
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
        catch(Exception ex){
            log.info("user notification push exception : {}", ex.getMessage());
        }
        return notification;
    }
    public ResponseModel pullNotification(UserNotificationDto notificationDto) {
        Optional<UserNotification> notification = userNotificationRepository.findById(notificationDto.getNotification_id());
        if(notification.isPresent()){
            userNotificationRepository.deleteById(notification.get().getNotification_id());
            return new ResponseModel(
                    "Notification has been deleted!",
                    200
            );
        }
        else{
            return new ResponseModel(
                    "Notification not found!",
                    500
            );
        }
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
    public UserNotification getNotificationById(Long notificationId) {
        Optional<UserNotification> optionalUserNotification = userNotificationRepository.findById(notificationId);
        return optionalUserNotification.orElse(null);
    }
}
