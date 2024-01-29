package com.Stack4Easy.Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Connections {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long connection_id;
    private Integer user_id;
    private Integer ref_id;
    private String username;
    private String refname;
    private Long total_games;
    private Long wins;
    private Boolean active;
    private Boolean isRequestAccepted;

    public Connections(
            Integer user_id,
            Integer ref_id,
            String username,
            String reference_name,
            Long total_games,
            Long wins,
            Boolean active,
            Boolean IsRequestAccepted
    ) {
        this.user_id = user_id;
        this.ref_id = ref_id;
        this.username = username;
        this.refname = reference_name;
        this.total_games = total_games;
        this.wins = wins;
        this.active = active;
        this.isRequestAccepted = IsRequestAccepted;
    }
}
