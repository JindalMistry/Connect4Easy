package com.Stack4Easy.Application.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConnSearch {
    private int user_id;
    private String username;
}
