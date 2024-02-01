package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.ResponseModel;
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
    public ResponseEntity<ResponseModel> pushNotification(@RequestBody UserNotificationDto userNotificationDto) {
        ResponseModel res = new ResponseModel(
                "Error while sending notification",
                500
        );
        UserNotification notification = userNotificationService.pushNotification(userNotificationDto);
        if(notification != null) {
            res.setData(notification);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/user/pullNotification")
    public ResponseEntity<ResponseModel> pullNotification(@RequestBody UserNotificationDto notificationDto){
        return ResponseEntity.ok(userNotificationService.pullNotification(notificationDto));
    }

    @PostMapping("/user/updateNotification")
    public ResponseEntity<ResponseModel> updateNotification(@RequestBody UserNotificationDto userNotificationDto){
        ResponseModel res = new ResponseModel(
                "Notification status updated successfully.",
                200
        );
        try{
            userNotificationService.updateNotification(userNotificationDto);
        }
        catch(Exception ex){
            res.setMessage(ex.getMessage());
            res.setStatus(500);
        }
        return ResponseEntity.ok(res);
    }
    @GetMapping("/user/getNotification/{username}")
    public ResponseEntity<List<UserNotification>> getUserNotifications(@PathVariable String username){
        List<UserNotification> list = userNotificationService.getNotificationByUsername(username);
        return ResponseEntity.ok(list);
    }
}
