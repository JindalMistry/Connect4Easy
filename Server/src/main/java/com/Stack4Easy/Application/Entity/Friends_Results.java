package com.Stack4Easy.Application.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Table
@Entity
@Data
@NoArgsConstructor
public class Friends_Results {
    private Integer player_one;
    private Integer player_two;
    private Date time;
    private Integer result;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long game_id;
}
