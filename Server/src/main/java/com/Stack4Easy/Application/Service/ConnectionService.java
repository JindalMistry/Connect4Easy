package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Repository.ConnRepository;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnRepository connRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    public List<Connections> getFriends(String username){
        return connRepository.findByUsernameAndIsRequestAccepted(username, true);
    }
    public List<Connections> getOnlineFriends(String username){
        return connRepository.findByUsernameAndActiveAndIsRequestAccepted(username, true, true);
    }

    public void addFriend(AddConnDto addConnDto) {
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
        if(user.getStatus() != UserStatus.OFFLINE){
            messagingTemplate.convertAndSendToUser(
                    user.getUsername(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(addConnDto.getUser_id())
                            .username(addConnDto.getUsername())
                            .type("FRIEND_REQUEST")
                            .build()
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
                        true
                )
        );
    }

    @Transactional
    public String acceptConnection(AddConnDto addConnDto) {
        Connections conn = connRepository.findByUsernameAndRefname(
                addConnDto.getReference_name(),
                addConnDto.getUsername()
        );
        if(conn != null) {
            conn.setIsRequestAccepted(true);
            User user = userRepository.findByUsername(addConnDto.getReference_name())
                    .orElseThrow();
            if(user.getStatus() != UserStatus.OFFLINE){
                messagingTemplate.convertAndSendToUser(
                        user.getUsername(),
                        "/queue/friends",
                        ConnNotification.builder()
                                .user_id(addConnDto.getUser_id())
                                .username(addConnDto.getUsername())
                                .type("ACCEPT_REQUEST")
                                .build()
                );
            }
        }
        return "SUCCESS";
    }
}
