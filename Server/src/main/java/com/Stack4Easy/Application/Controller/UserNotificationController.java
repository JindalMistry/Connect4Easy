package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.UserNotification;
import com.Stack4Easy.Application.Service.UserNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class UserNotificationController {
    private final UserNotificationService userNotificationService;

    @PostMapping("/user/pushNotification")
    public ResponseEntity<UserNotification> pushNotification(@RequestBody UserNotificationDto userNotificationDto) {
        UserNotification notification = userNotificationService.pushNotification(userNotificationDto);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/user/pullNotification")
    public ResponseEntity<String> pullNotification(@RequestBody UserNotificationDto notificationDto){
        try{
            userNotificationService.pullNotification(notificationDto);
            return ResponseEntity.ok("DELETED");
        }
        catch(Exception ex){
            log.info(ex.getMessage());
            return ResponseEntity.ok("ERROR");
        }
    }

    @PostMapping("/user/updateNotification")
    public ResponseEntity<String> updateNotification(@RequestBody UserNotificationDto userNotificationDto){
        try{
            userNotificationService.updateNotification(userNotificationDto);
            return ResponseEntity.ok("SENT");
        }
        catch(Exception ex){
            log.info(ex.getMessage());
            return ResponseEntity.ok("ERROR");
        }
    }
    @GetMapping("/user/getNotification/{username}")
    public ResponseEntity<List<UserNotification>> getUserNotifications(@PathVariable String username){
        List<UserNotification> list = userNotificationService.getNotificationByUsername(username);
        return ResponseEntity.ok(list);
    }
}
