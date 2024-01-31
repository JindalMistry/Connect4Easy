package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnSearch;
import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Entity.UserNotification;
import com.Stack4Easy.Application.Service.ConnectionService;
import com.Stack4Easy.Registration.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ConnectionsController {

    private final ConnectionService connectionService;
    private final UserService userService;
    @GetMapping("/friends/{username}")
    public List<Connections> getFriends(
            @PathVariable String username
    ){
        return connectionService.getFriends(username);
    }

    @GetMapping("/friends/search/{str}/{user_id}")
    public List<ConnSearch> searchUser(
            @PathVariable String str,
            @PathVariable Integer user_id
    ){
        return userService.getUserBySearch(str, user_id);
    }

    @PostMapping("/friends/addConnection")
    public ResponseEntity<ResponseModel> addFriend(@RequestBody AddConnDto addConnDto){
        return ResponseEntity.ok(connectionService.addFriend(addConnDto));
    }

    @PostMapping("/friends/acceptConnection/{type}")
    public ResponseEntity<String> acceptConnection(@RequestBody AddConnDto addConnDto, @PathVariable String type) {
        return ResponseEntity.ok(connectionService.acceptConnection(addConnDto, type));
    }

}
