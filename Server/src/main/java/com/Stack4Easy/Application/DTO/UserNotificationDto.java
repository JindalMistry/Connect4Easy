package com.Stack4Easy.Application.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserNotificationDto {
    private Long notification_id;
    private String message;
    private Integer user_id;
    private String username;
    private Boolean IsRead;
    private String type;
    private Integer ref_id;
    private String refname;
}
