package com.Stack4Easy.Registration.Service;

import com.Stack4Easy.Application.DTO.FriendSearch;
import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Repository.FriendRepository;
import com.Stack4Easy.Registration.DTO.UserDto;
import com.Stack4Easy.Registration.Entity.Role;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Entity.UserStatus;
import com.Stack4Easy.Registration.Repository.RoleRepository;
import com.Stack4Easy.Registration.Repository.UserRepository;
import com.Stack4Easy.Security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final FriendRepository friendRepository;
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
    public String login(UserDto userDto) {
        Optional<User> dbUser = userRepository.findByUsername(userDto.getUsername());
        if(dbUser.isPresent()){
            User user = dbUser.get();
            if(user.getPassword().matches(userDto.getPassword())){
                user.setStatus(UserStatus.ONLINE);
                //userRepository.save(user);
                List<Friends> friends = friendRepository.findAllByReferencename(userDto.getUsername());
                friends.forEach((item) -> {
                    item.setActive(true);
                });
                //friendRepository.saveAll(friends);
                return jwtService.generateToken(user);
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
        throw new UsernameNotFoundException("User with this username does not exists!");
    }

    public List<FriendSearch> getUserBySearch(String searchString) {
        List<FriendSearch> list = new ArrayList<>();
        userRepository.findByUsernameContainingIgnoreCase(searchString).forEach((item) -> {
            list.add(FriendSearch.builder().user_id(item.getUser_id()).username(item.getUsername()).build());
        });
        return list;
    }
}
