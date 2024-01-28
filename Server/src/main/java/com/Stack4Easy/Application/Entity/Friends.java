package com.Stack4Easy.Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Friends {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long connection_id;
    private Integer user_id;
    private Integer ref_id;
    private String username;
    private String referencename;
    private Long total_games;
    private Long wins;
    private Boolean active;

    public Friends(Integer user_id, Integer ref_id, String username, String referencename, Long total_games, Long wins, Boolean active) {
        this.user_id = user_id;
        this.ref_id = ref_id;
        this.username = username;
        this.referencename = referencename;
        this.total_games = total_games;
        this.wins = wins;
        this.active = active;
    }
}
