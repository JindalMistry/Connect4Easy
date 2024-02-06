package com.Stack4Easy.Registration.Controller;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Service.ConnectionService;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConnectionService connectionService;
    @PostMapping("/register")
    public ResponseEntity<ResponseModel> register(@RequestBody UserDto userDto){
        ResponseModel response = userService.register(userDto);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<ResponseModel> login(@RequestBody UserDto userDto){
        ResponseModel response = userService.login(userDto);
        List<Connections> connectionsList =  connectionService.getOnlineFriends(userDto.getUsername());
        connectionsList.forEach(user -> {
            messagingTemplate.convertAndSendToUser(
                    user.getRefname(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(user.getUser_id())
                            .username(user.getUsername())
                            .type("STATUS")
                            .value("ONLINE")
                            .build()
            );
        });

        return ResponseEntity.ok(response);
    }
    @GetMapping("/logout/{username}")
    public ResponseEntity<ResponseModel> logout(@PathVariable String username){
        ResponseModel res = userService.logout(new UserDto(
                0,
                username,
                "",
                ""
        ));
        return ResponseEntity.ok(res);
    }
}
