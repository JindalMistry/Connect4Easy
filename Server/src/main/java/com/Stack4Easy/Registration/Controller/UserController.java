package com.Stack4Easy.Registration.Controller;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Service.ConnectionService;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConnectionService connectionService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto){
        String response = userService.register(userDto);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto){
        String response = userService.login(userDto);
        List<Connections> connectionsList =  connectionService.getOnlineFriends(userDto.getUsername());

        connectionsList.forEach(user -> {
            messagingTemplate.convertAndSendToUser(
                    user.getRefname(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(user.getUser_id())
                            .username(user.getUsername())

                            .build()
            );
        });
        return ResponseEntity.ok(response);
    }
}
