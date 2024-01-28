package com.Stack4Easy.Application.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddFriendDto {
    private Integer user_id;
    private String username;
    private String refrencename;
    private Integer ref_id;

}
