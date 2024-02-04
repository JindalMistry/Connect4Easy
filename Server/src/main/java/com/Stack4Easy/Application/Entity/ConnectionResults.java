package com.Stack4Easy.Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Table
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionResults {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long game_id;
    private Integer player_one;
    private Integer player_two;
    private Date time;
    private Integer result;
    private String icon_one;
    private String icon_two;

    public ConnectionResults(Integer player_one, Integer player_two) {
        this.player_one = player_one;
        this.player_two = player_two;
        this.result = 0;
        this.time = new Date();
    }

    public ConnectionResults(Integer player_one, Integer player_two, String icon_one, String icon_two) {
        this.player_one = player_one;
        this.player_two = player_two;
        this.icon_one = icon_one;
        this.icon_two = icon_two;
        this.time = new Date();
    }
}
