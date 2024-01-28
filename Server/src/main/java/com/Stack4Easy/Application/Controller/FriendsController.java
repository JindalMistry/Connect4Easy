package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.DTO.AddFriendDto;
import com.Stack4Easy.Application.DTO.FriendSearch;
import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Repository.FriendRepository;
import com.Stack4Easy.Application.Service.FriendService;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import com.Stack4Easy.Registration.Service.UserService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class FriendsController {

    private final FriendService friendService;
    private final UserService userService;
    @GetMapping("/friends/{username}")
    public List<Friends> getFriends(
            @PathVariable String username
    ){
        return friendService.getFriends(username);
    }

    @GetMapping("/friends/search/{str}")
    public List<FriendSearch> searchUser(@PathVariable String str){
        return userService.getUserBySearch(str);
    }

    @PostMapping("/friends/addfriend")
    public void addFriend(@RequestBody AddFriendDto addFriendDto){
        friendService.addFriend(addFriendDto);
    }
}
