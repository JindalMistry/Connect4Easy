package com.Stack4Easy.Application.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendNotification {
    private Integer user_id;
    private Integer ref_id;
    private String username;
    private String referencename;
    private Long total_games;
    private Long wins;
    private Boolean active;
    private String type;
}
