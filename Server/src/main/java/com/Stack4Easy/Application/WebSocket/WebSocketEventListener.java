package com.Stack4Easy.Application.WebSocket;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

//    @EventListener
//    public void handleWebSocketConnectListener(SessionConnectedEvent event){
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//        String sessionId = accessor.getMessageHeaders().get(SimpMessageHeaderAccessor.SESSION_ID_HEADER, String.class);
//        String username = getUserId(accessor);
//    }
    private String getUserId(StompHeaderAccessor accessor) {
        GenericMessage<?> generic = (GenericMessage<?>) accessor.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
        if (nonNull(generic)) {
            SimpMessageHeaderAccessor nativeAccessor = SimpMessageHeaderAccessor.wrap(generic);
            List<String> userIdValue = nativeAccessor.getNativeHeader("sessionId");
            return isNull(userIdValue) ? null : userIdValue.stream().findFirst().orElse(null);
        }
        return null;
    }
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) accessor.getSessionAttributes().get("username");
        log.info("User disconnected: {}", username);
        if(username != null){
            userService.logout(
                    new UserDto(
                            0,
                            username,
                            "",
                            ""
                    )
            );
        }
    }
}
