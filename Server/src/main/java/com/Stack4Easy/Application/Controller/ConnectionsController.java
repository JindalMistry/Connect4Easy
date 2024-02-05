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
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
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
        ResponseModel model = connectionService.addFriend(addConnDto);
        log.info("Model here : {}", model);
        return ResponseEntity.ok(model);
    }

    @PostMapping("/friends/acceptConnection/{type}")
    public ResponseEntity<ResponseModel> acceptConnection(@RequestBody AddConnDto addConnDto, @PathVariable String type) {
        return ResponseEntity.ok(connectionService.acceptConnection(addConnDto, type));
    }

    @PostMapping("/friends/sendChallenge")
    public ResponseEntity<ResponseModel> sendChallenge(@RequestBody AddConnDto connections) {
        ResponseModel responseModel = new ResponseModel(
                "Challenge has been sent!",
                200
        );
        connectionService.sendChallenge(connections);
        return ResponseEntity.ok(responseModel);
    }

    @PostMapping("/friends/acceptChallenge")
    public ResponseEntity<ResponseModel> acceptChallenge(@RequestBody UserNotificationDto connDto) {
        return ResponseEntity.ok(connectionService.acceptChallenge(connDto));
    }
    @PostMapping("/friends/declineChallenge")
    public ResponseEntity<ResponseModel> declineChallenge(@RequestBody UserNotificationDto connDto){
        return ResponseEntity.ok(connectionService.declineChallenge(connDto));
    }

    @GetMapping("/friends/manage-game-status/{username}/{opp}/{type}")
    public ResponseEntity<ResponseModel> startGame(
            @PathVariable String username,
            @PathVariable String opp,
            @PathVariable String type
    ) {
         return ResponseEntity.ok(connectionService.startGame(username, opp, type));
    }
}
