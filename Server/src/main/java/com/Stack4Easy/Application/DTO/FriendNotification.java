package com.Stack4Easy.Application.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendNotification {
    public Integer user_id;
    public String username;
    public String type;
    public String value;
    public String content;
}
