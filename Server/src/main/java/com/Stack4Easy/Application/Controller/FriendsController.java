package com.Stack4Easy.Application.Controller;

import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Repository.FriendRepository;
import com.Stack4Easy.Application.Service.FriendService;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class FriendsController {

    private final FriendService friendService;
    @GetMapping("/friends/{username}")
    public List<Friends> getFriends(
            @PathVariable String username
    ){
        return friendService.getFriends(username);
    }
}
