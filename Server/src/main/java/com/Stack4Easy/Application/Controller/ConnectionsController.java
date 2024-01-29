package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnSearch;
import com.Stack4Easy.Application.Entity.Connections;
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
    public ResponseEntity<String> addFriend(@RequestBody AddConnDto addConnDto){
        connectionService.addFriend(addConnDto);
        return ResponseEntity.ok("SENT");
    }

    @PostMapping("/friends/acceptConnection")
    public ResponseEntity<String> acceptConnection(@RequestBody AddConnDto addConnDto) {
        String message = connectionService.acceptConnection(addConnDto);
        if(message.matches("SUCCESS")){
            return ResponseEntity.ok("SUCCESS");
        }
        else return ResponseEntity.ok("ERROR");
    }
}
