package com.Stack4Easy.Application.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddConnDto {
    private Integer user_id;
    private String username;
    private Integer ref_id;
    private String reference_name;
}
