package com.Stack4Easy.Application.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table
@Entity
@Data
@NoArgsConstructor
public class ConnectionGames {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private Long game_id;
    private Integer colum_id;
    private Integer row_id;
    private String icon;

    public ConnectionGames(Long game_id, Integer colum_id, Integer row_id, String icon) {
        this.game_id = game_id;
        this.colum_id = colum_id;
        this.row_id = row_id;
        this.icon = icon;
    }
}
