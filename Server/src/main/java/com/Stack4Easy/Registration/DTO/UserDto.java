package com.Stack4Easy.Registration.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class UserDto {
    private Integer user_id;
    private String username;
    private String password;
    private String token;
}
