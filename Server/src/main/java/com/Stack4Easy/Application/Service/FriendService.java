package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Repository.FriendRepository;
import com.Stack4Easy.Registration.Entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository friendRepository;
    public List<Friends> getFriends(String username){
        return friendRepository.findAllByUsername(username);
    }
    public List<Friends> getOnlineFriends(String username){
        return friendRepository.findAllByUsernameAndActive(username, true);
    }
}
