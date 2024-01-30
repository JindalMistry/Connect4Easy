package com.Stack4Easy.Application.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long notification_id;
    private String message;
    private Integer user_id;
    private String username;
    private Integer ref_id;
    private String refname;
    private Boolean IsRead;
    private Date timestamp;
    private String type;

    public UserNotification(
            String message,
            Integer user_id,
            String username,
            Boolean isRead,
            String type,
            Integer ref_id,
            String refname
    ) {
        this.message = message;
        this.user_id = user_id;
        this.username = username;
        IsRead = isRead;
        timestamp = new Date();
        this.type = type;
        this.ref_id = ref_id;
        this.refname =refname;
    }
}
