package com.Stack4Easy.Application.WebSocket;

import com.Stack4Easy.Registration.DTO.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class WebSocketController {
    @MessageMapping("/chat.subUser")
    @SendTo("/topic/public")
    public void subscribeUser(
            @Payload UserDto userDto,
            SimpMessageHeaderAccessor headerAccessor
    ){
        log.info("Public queue subscribed {}", userDto.getUsername());
        headerAccessor.getSessionAttributes().put("username", userDto.getUsername());
    }
}
