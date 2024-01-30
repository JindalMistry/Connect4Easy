package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Entity.UserNotification;
import com.Stack4Easy.Application.Repository.ConnRepository;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnRepository connRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserNotificationService userNotificationService;
    public List<Connections> getFriends(String username){
        return connRepository.findByUsernameAndIsRequestAccepted(username, true);
    }
    public List<Connections> getOnlineFriends(String username){
        return connRepository.findByUsernameAndActiveAndIsRequestAccepted(username, true, true);
    }

    public UserNotification addFriend(AddConnDto addConnDto) {
        UserNotification res = null;
        User user = userRepository.findByUsername(addConnDto.getReference_name())
                .orElseThrow();
        connRepository.save(
                new Connections(
                        addConnDto.getUser_id(),
                        addConnDto.getRef_id(),
                        addConnDto.getUsername(),
                        addConnDto.getReference_name(),
                        0L,
                        0L,
                        user.getStatus() != UserStatus.OFFLINE,
                        false
                )
        );
        res = userNotificationService.pushNotification(
                new UserNotificationDto(
                        0L,
                        String.format("You sent a friend request to %s", addConnDto.getReference_name()),
                        addConnDto.getUser_id(),
                        addConnDto.getUsername(),
                        false,
                        "MESSAGE",
                        addConnDto.getRef_id(),
                        addConnDto.getReference_name()
                )
        );
        if(user.getStatus() != UserStatus.OFFLINE){
            messagingTemplate.convertAndSendToUser(
                    user.getUsername(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(addConnDto.getUser_id())
                            .username(addConnDto.getUsername())
                            .type("MESSAGE")
                            .content("RECEIVED")
                            .build()
            );
            userNotificationService.pushNotification(
                    new UserNotificationDto(
                            0L,
                            String.format("You have a friend request from %s", addConnDto.getUsername()),
                            addConnDto.getRef_id(),
                            addConnDto.getReference_name(),
                            false,
                            "FRIEND_REQUEST",
                            addConnDto.getUser_id(),
                            addConnDto.getUsername()
                    )
            );
        }
        connRepository.save(
                new Connections(
                        addConnDto.getRef_id(),
                        addConnDto.getUser_id(),
                        addConnDto.getReference_name(),
                        addConnDto.getUsername(),
                        0L,
                        0L,
                        true,
                        false
                )
        );
        return res;
    }

    @Transactional
    public String acceptConnection(AddConnDto addConnDto, String type) {
        if(type.matches("DECLINE")){
            connRepository.deleteByUsername(addConnDto.getUsername());
            connRepository.deleteByUsername(addConnDto.getReference_name());
        }
        else if(type.matches("ACCEPT")){
            Connections conn = connRepository.findByUsernameAndRefname(
                    addConnDto.getUsername(),
                    addConnDto.getReference_name()
            );
            Connections connRef = connRepository.findByUsernameAndRefname(
                    addConnDto.getReference_name(),
                    addConnDto.getUsername()
            );
            if(conn != null) {
                conn.setIsRequestAccepted(true);
            }
            if(connRef != null) {
                connRef.setIsRequestAccepted(true);
            }
        }
        User user = userRepository.findByUsername(addConnDto.getReference_name())
                .orElseThrow();
        if(user.getStatus() != UserStatus.OFFLINE){
            messagingTemplate.convertAndSendToUser(
                    user.getUsername(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(user.getUser_id())
                            .username(user.getUsername())
                            .type("MESSAGE")
                            .content(type)
                            .build()
            );
        }
        userNotificationService.pushNotification(
                new UserNotificationDto(
                        0L,
                        String.format("%s %s your friend request!", addConnDto.getUsername(), type.matches("ACCEPT") ? "accepted" : "declined"),
                        addConnDto.getRef_id(),
                        addConnDto.getReference_name(),
                        false,
                        "MESSAGE",
                        addConnDto.getUser_id(),
                        addConnDto.getUsername()
                )
        );
        return "SUCCESS";
    }
}
