package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.DTO.UserNotificationDto;
import com.Stack4Easy.Application.Entity.ConnectionResults;
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

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnRepository connRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserNotificationService userNotificationService;
    private final ConnResultsService connResultsService;
    public List<Connections> getFriends(String username){
        return connRepository.findByUsernameAndIsRequestAccepted(username, true);
    }
    public List<Connections> getOnlineFriends(String username){
        return connRepository.findByUsernameAndActiveAndIsRequestAccepted(username, true, true);
    }

    public ResponseModel addFriend(AddConnDto addConnDto) {
        UserNotification res = null;
        User user = userRepository.findByUsername(addConnDto.getReference_name())
                .orElseThrow();
        Optional<Connections> isFriend = connRepository.findByUsernameAndRefname(addConnDto.getUsername(), addConnDto.getReference_name());
        if(isFriend.isPresent()){
            String message = "You have already pending request to this user!";
            if(isFriend.get().getIsRequestAccepted()){
                message = "You are already friend with this user!";
            }
            return new ResponseModel(
                    message,
                    500
            );
        }
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
        return new ResponseModel(
                "Friend request has been sent!",
                200,
                res
        );
    }

    @Transactional
    public ResponseModel acceptConnection(AddConnDto addConnDto, String type) {
        if(type.matches("DECLINE")){
            connRepository.deleteByUsername(addConnDto.getUsername());
            connRepository.deleteByUsername(addConnDto.getReference_name());
        }
        else if(type.matches("ACCEPT")){
            Optional<Connections> conn = connRepository.findByUsernameAndRefname(
                    addConnDto.getUsername(),
                    addConnDto.getReference_name()
            );
            Optional<Connections> connRef = connRepository.findByUsernameAndRefname(
                    addConnDto.getReference_name(),
                    addConnDto.getUsername()
            );
            conn.ifPresent(connections -> connections.setIsRequestAccepted(true));
            connRef.ifPresent(connections -> connections.setIsRequestAccepted(true));
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
        return new ResponseModel(
                String.format("You are now friends with %s", addConnDto.getUsername()),
                200
        );
    }

    public void sendChallenge(AddConnDto connections) {
        Optional<User> user = userRepository.findByUsername(connections.getReference_name());
        if(user.isPresent()){
            UserNotification notification = userNotificationService.pushNotification(
                    new UserNotificationDto(
                            0L,
                            String.format("You have a challenge from %s", connections.getUsername()),
                            connections.getRef_id(),
                            connections.getReference_name(),
                            false,
                            "CHALLENGE_REQUEST",
                            connections.getUser_id(),
                            connections.getUsername()
                    )
            );
            if(user.get().getStatus() == UserStatus.ONLINE){
                messagingTemplate.convertAndSendToUser(
                        connections.getReference_name(),
                        "/queue/friends",
                        ConnNotification.builder()
                                .user_id(connections.getUser_id())
                                .username(connections.getUsername())
                                .type("CHALLENGE_SEND")
                                .content(notification.getNotification_id().toString())
                                .build()
                );
            }
        }
    }

    public ResponseModel acceptChallenge(UserNotificationDto connDto) {
        ResponseModel res = new ResponseModel();
        res.setStatus(200);
        Optional<User> optUser = userRepository.findByUsername(connDto.getRefname());

        if(optUser.isPresent()){
            User user = optUser.get();
            UserNotification notification = userNotificationService.getNotificationById(connDto.getNotification_id());
            if(notification != null) {
                long dateDiff = (new Date().getTime() - notification.getTimestamp().getTime()) / (1000 * 60);
                boolean isValid = (dateDiff < 5);
                if(isValid){
                    if(user.getStatus() == UserStatus.INGAME){
                        res.setMessage("Player is already in game!");
                    }
                    else if(user.getStatus() == UserStatus.OFFLINE){
                        res.setMessage("Player is not online!");
                    }
                    else{
                        user.setStatus(UserStatus.INGAME);
                        userRepository.save(user);
                        userNotificationService.pushNotification(
                                new UserNotificationDto(
                                        0L,
                                        String.format("You challenge has been accepted by %s", connDto.getUsername()),
                                        connDto.getRef_id(),
                                        connDto.getRefname(),
                                        false,
                                        "CHALLENGE_ACCEPT",
                                        connDto.getUser_id(),
                                        connDto.getUsername()
                                )
                        );
                        ConnectionResults room = connResultsService.createRoom(
                                new AddConnDto(
                                        connDto.getUser_id(),
                                        connDto.getUsername(),
                                        connDto.getRef_id(),
                                        connDto.getRefname()
                                )
                        );
                        if(room != null){
                            messagingTemplate.convertAndSendToUser(
                                    connDto.getRefname(),
                                    "/queue/friends",
                                    ConnNotification.builder()
                                            .user_id(connDto.getUser_id())
                                            .username(connDto.getUsername())
                                            .type("CHALLENGE_ACCEPT")
                                            .content(room.getGame_id().toString())
                                            .build()
                            );
                            res.setMessage("Game Challenge has been accepted!");
                            res.setData(room);
                        }
                        else{
                            res.setStatus(500);
                            res.setMessage("Error while creating game room");
                        }
                    }
                }
                else{
                    res.setMessage("Session has expired, PS-Sessions are only valid for 5 minutes.");
                }
                userNotificationService.pullNotification(
                        new UserNotificationDto(
                                notification.getNotification_id(),
                                "",
                                0,
                                "",
                                false,
                                "",
                                0,
                                ""
                        )
                );
            }
        }
        return res;
    }

    public ResponseModel declineChallenge(UserNotificationDto connDto) {
        userNotificationService.pullNotification(
                new UserNotificationDto(
                        connDto.getNotification_id(),
                        "",
                        0,
                        "",
                        false,
                        "",
                        0,
                        ""
                )
        );
        userNotificationService.pushNotification(
                new UserNotificationDto(
                        0L,
                        String.format("%s declined your challenge request!", connDto.getUsername()),
                        connDto.getRef_id(),
                        connDto.getRefname(),
                        false,
                        "MESSAGE",
                        connDto.getUser_id(),
                        connDto.getUsername()
                )
        );
        Optional<User> user = userRepository.findByUsername(connDto.getRefname());
        if(user.isPresent() && user.get().getStatus() == UserStatus.ONLINE){
            messagingTemplate.convertAndSendToUser(
                    connDto.getRefname(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(connDto.getUser_id())
                            .username(connDto.getUsername())
                            .type("CHALLENGE_DECLINE")
                            .content(connDto.getNotification_id().toString())
                            .build()
            );
        }
        return new ResponseModel(
                "Challenge request declined.",
                200
        );
    }

    public ResponseModel startGame(String username, String type) {
        ResponseModel res = new ResponseModel();
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            if(user.get().getStatus() == UserStatus.ONLINE){
                User change = user.get();
                change.setStatus(UserStatus.INGAME);
                userRepository.save(change);
                messagingTemplate.convertAndSendToUser(
                        username,
                        "/queue/friends",
                        ConnNotification.builder()
                                .user_id(0)
                                .type(type.matches("accept") ? "START_GAME" : "DO_NOT_START")
                                .build()
                );
                res.setStatus(200);
            }
            else if(user.get().getStatus() == UserStatus.INGAME){
                res.setStatus(500);
                res.setMessage("User is in game, please try again later!");
            }
            else {
                res.setStatus(500);
                res.setMessage("User is offline, please try again later!");
            }
        }
        else{
            res.setStatus(500);
            res.setMessage("User not found!");
        }
        return res;
    }
}
