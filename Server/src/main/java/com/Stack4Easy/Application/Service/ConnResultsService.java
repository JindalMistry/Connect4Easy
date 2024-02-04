package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.AddConnDto;
import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.DTO.ResponseModel;
import com.Stack4Easy.Application.Entity.ConnectionResults;
import com.Stack4Easy.Application.Repository.ConnResultRepository;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import com.Stack4Easy.Registration.Service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.bind.validation.ValidationErrors;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConnResultsService {
    private final ConnResultRepository connResultRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public ConnectionResults createRoom(AddConnDto conn){
        return connResultRepository.save(
                new ConnectionResults(
                    conn.getUser_id(),
                    conn.getRef_id()
                )
        );
    }

    @Transactional
    public void assignIcons(ConnectionResults connectionResults) {
        Optional<ConnectionResults> gameRoom = connResultRepository.findById(connectionResults.getGame_id());
        if(gameRoom.isPresent()){
            ConnectionResults game = gameRoom.get();
            game.setIcon_one(connectionResults.getIcon_one());
            game.setIcon_two(connectionResults.getIcon_two());
            Optional<User> userOpt = userRepository.findById(connectionResults.getPlayer_two());
            if(userOpt.isPresent()){
                User user = userOpt.get();
                if(user.getStatus() == UserStatus.INGAME){
                    messagingTemplate.convertAndSendToUser(
                        user.getUsername(),
                            "/queue/friends",
                            ConnNotification.builder()
                                    .user_id(connectionResults.getPlayer_one())
                                    .type("ASSIGN_ICON")
                                    .content(String.format("%s_%s", connectionResults.getIcon_one(), connectionResults.getIcon_two()))
                                    .build()
                    );
                }
            }
        }
    }

    @Transactional
    public void exitGame(String username) {
        Optional<User> optUser = userRepository.findByUsername(username);
        if(optUser.isPresent()){
            User user = optUser.get();
            user.setStatus(UserStatus.ONLINE);
        }
    }

    public ResponseModel rematch(ConnectionResults connectionResults) {
        ResponseModel res = new ResponseModel();
        Optional<User> optUser = userRepository.findById(connectionResults.getPlayer_one());
        Optional<User> optOppUser = userRepository.findById(connectionResults.getPlayer_two());
        if(optUser.isPresent() && optOppUser.isPresent()){
            User user = optUser.get();
            User opp = optOppUser.get();
            if(user.getStatus() == UserStatus.INGAME && opp.getStatus() == UserStatus.INGAME){
                ConnectionResults room = connResultRepository.save(
                        new ConnectionResults(
                                connectionResults.getPlayer_one(),
                                connectionResults.getPlayer_two(),
                                connectionResults.getIcon_one(),
                                connectionResults.getIcon_two()
                        )
                );
                messagingTemplate.convertAndSendToUser(
                        opp.getUsername(),
                        "/queue/friends",
                        ConnNotification.builder()
                                .user_id(user.getUser_id())
                                .type("START_REMATCH")
                                .content(String.format("%s_%s_%s", room.getGame_id(), connectionResults.getIcon_one(), connectionResults.getIcon_two()))
                                .build()
                );
                res.setData(room);
                res.setMessage("Room has been created!");
                res.setStatus(200);
            }
            else{
                res.setStatus(500);
                res.setMessage("Opponent is offline!, try again later.");
            }
        }
        else{
            res.setStatus(500);
            res.setMessage("No user found!");
            log.info("No user present");
        }
        return res;
    }

    public ResponseModel sendRematchRequest(String username, String opp) {
        Optional<User> optUser = userRepository.findByUsername(opp);
        if(optUser.isPresent()) {
            User user = optUser.get();
            if(user.getStatus() == UserStatus.INGAME) {
                messagingTemplate.convertAndSendToUser(
                        opp,
                        "/queue/friends",
                        ConnNotification.builder()
                                .type("REMATCH_REQUEST")
                                .build()
                );
                return new ResponseModel(
                        "SUCCESS",
                        200
                );
            }
            else{
                return new ResponseModel(
                        "ERROR",
                        500
                );
            }
        }
        else return new ResponseModel();
    }

    @Transactional
    public ResponseModel updateGameStatus(Long gameId, Integer userId) {
        Optional<ConnectionResults> optRoom = connResultRepository.findById(gameId);
        if(optRoom.isPresent()){
            ConnectionResults room = optRoom.get();
            room.setResult(userId);
        }
        return new ResponseModel(
                "Status has been updated",
                200
        );
    }
}
