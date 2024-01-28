package com.Stack4Easy.Registration.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "UserMaster")
@RequiredArgsConstructor
@ToString
@AllArgsConstructor
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int user_id;
    private String username;
    private String password;
    private String email;
    private String mobile;
    private Boolean enabled;
    private String otp;
    private Date otp_time;
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles;
    private UserStatus status;

    public User(String username, String password, Set<Role> roles){
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.enabled = true;
        this.status = UserStatus.OFFLINE;
    }
    public User(String username, String password){
        this.username = username;
        this.password = password;
        this.enabled = true;
        this.status = UserStatus.OFFLINE;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
