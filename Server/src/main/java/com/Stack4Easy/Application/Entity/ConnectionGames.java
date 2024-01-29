package com.Stack4Easy.Application.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table
@Entity
@Data
@NoArgsConstructor
public class ConnectionGames {
    @Id
    private Long game_id;
    private Integer colum_id;
    private Integer row_id;
}
