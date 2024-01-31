package com.Stack4Easy.Registration.Service;

import com.Stack4Easy.Application.DTO.ConnNotification;
import com.Stack4Easy.Application.DTO.ConnSearch;
import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Repository.ConnRepository;
import com.Stack4Easy.Application.Service.ConnectionService;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Entity.Role;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.RoleRepository;
import com.Stack4Easy.Registration.Repository.UserRepository;
import com.Stack4Easy.Security.JwtService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final ConnRepository connRepository;
    private final EntityManager entityManager;
    private final SimpMessagingTemplate messagingTemplate;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()) {
            return user.get();
        }
        throw new UsernameNotFoundException("User with this name does not exist!");
    }

    public String register(UserDto userDto) {
        Optional<User> user = userRepository.findByUsername(userDto.getUsername());
        if(user.isPresent()){
            throw new UsernameNotFoundException("User with this username already exists!");
        }
        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByAuthority("USER")
                .orElseThrow(() -> new IllegalStateException("Role not found...")));
        log.info(userDto.toString());
        User newUser = new User(
            userDto.getUsername(),
            userDto.getPassword(),
            roles
        );
        log.info(newUser.toString());
        userRepository.save(newUser);
        return "User registered successfully";
    }
    @Transactional
    public UserDto login(UserDto userDto) {
        Optional<User> dbUser = userRepository.findByUsername(userDto.getUsername());
        if(dbUser.isPresent()){
            User user = dbUser.get();
            if(user.getPassword().matches(userDto.getPassword())){
                user.setStatus(UserStatus.ONLINE);
                List<Connections> friends = connRepository.findByRefname(userDto.getUsername());
                friends.forEach((item) -> {
                    item.setActive(true);
                });
                return new UserDto(
                        user.getUser_id(),
                        user.getUsername(),
                        "",
                        jwtService.generateToken(user)
                );
            }
            throw new IllegalStateException("Password does not match!");
        }
        throw new UsernameNotFoundException("User with this username does not exists!");
    }

    @Transactional
    public String logout(UserDto userDto){
        Optional<User> dbUser = userRepository.findByUsername(userDto.getUsername());
        if(dbUser.isPresent()){
            User user = dbUser.get();
            user.setStatus(UserStatus.OFFLINE);
        }
        else {
            throw new UsernameNotFoundException("User with this username does not exists!");
        }
        List<Connections> connectionsList =  connRepository.findByUsernameAndActiveAndIsRequestAccepted(userDto.getUsername(), true, true);

        connectionsList.forEach(user -> {
            messagingTemplate.convertAndSendToUser(
                    user.getRefname(),
                    "/queue/friends",
                    ConnNotification.builder()
                            .user_id(user.getUser_id())
                            .username(user.getUsername())
                            .type("STATUS")
                            .value("OFFLINE")
                            .build()
            );
        });
        List<Connections> friendList = connRepository.findByRefname(userDto.getUsername());
        friendList.forEach(obj -> {
            obj.setActive(false);
        });
        return "Success";
    }

    public List<ConnSearch> getUserBySearch(String searchString, Integer user_id) {
        List<ConnSearch> list = new ArrayList<>();
        String query =
                "select user_id, username from User where username ILIKE '%" + searchString + "%'" +
                        " and user_id not in (" + user_id + ")";
        Query result = entityManager.createQuery(query);
        List<Object[]> arr = result.getResultList();
        arr.forEach((item) -> {
            list.add(
                    ConnSearch.builder()
                            .user_id((int)item[0])
                            .username((String)item[1])
                            .build()
            );
        });
        return list;
    }
}
