package com.Stack4Easy.Registration.Controller;
import com.Stack4Easy.Application.DTO.FriendNotification;
import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Service.FriendService;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Entity.User;
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
    private final FriendService friendService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto){
        String response = userService.register(userDto);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto){
        String response = userService.login(userDto);
        List<Friends> friendsList =  friendService.getOnlineFriends(userDto.getUsername());

        friendsList.forEach(user -> {
            messagingTemplate.convertAndSendToUser(
                    user.getReferencename(),
                    "/queue/friends",
                    FriendNotification.builder()
                            .user_id(user.getRef_id())
                            .ref_id(user.getUser_id())
                            .username(user.getReferencename())
                            .referencename(user.getUsername())
                            .type("STATUS_ONLINE")
                            .active(true)
                            .build()
            );
        });
        return ResponseEntity.ok(response);
    }
}
