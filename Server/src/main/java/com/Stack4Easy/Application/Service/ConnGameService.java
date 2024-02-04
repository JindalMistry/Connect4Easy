package com.Stack4Easy.Application.Service;

import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.Entity.ConnectionGames;
import com.Stack4Easy.Application.Entity.ConnectionResults;
import com.Stack4Easy.Application.Repository.ConnGamesRepository;
import com.Stack4Easy.Application.Repository.ConnResultRepository;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConnGameService {
    private final ConnGamesRepository connGamesRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ConnResultRepository connResultRepository;

    public void saveMove(ConnectionGames games, Integer Id) {
        connGamesRepository.save(
                new ConnectionGames(
                   games.getGame_id(),
                   games.getColum_id(),
                   games.getRow_id(),
                   games.getIcon()
                )
        );
        Optional<ConnectionResults> conn = connResultRepository.findById(games.getGame_id());
        if(conn.isPresent()){
            ConnectionResults room = conn.get();
            Integer opp_id = (Objects.equals(Id, room.getPlayer_one())) ? room.getPlayer_two() : room.getPlayer_one();
            Optional<User> userOpt = userRepository.findById(opp_id);
            if(userOpt.isPresent()){
                User user = userOpt.get();
                if(user.getStatus() == UserStatus.INGAME){
                    messagingTemplate.convertAndSendToUser(
                            user.getUsername(),
                            "/queue/friends",
                            ConnNotification.builder()
                                    .user_id(Id)
                                    .type("MOVE")
                                    .content(String.format("%s_%s", games.getRow_id(), games.getColum_id()))
                                    .build()
                    );
                }
            }
        }
    }
}
