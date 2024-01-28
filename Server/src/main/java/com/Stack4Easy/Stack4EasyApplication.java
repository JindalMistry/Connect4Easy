package com.Stack4Easy;

import com.Stack4Easy.Application.Entity.Friends;
import com.Stack4Easy.Application.Repository.FriendRepository;
import com.Stack4Easy.Registration.Entity.Role;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Repository.RoleRepository;
import com.Stack4Easy.Registration.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class Stack4EasyApplication {
	public static void main(String[] args) {
		SpringApplication.run(Stack4EasyApplication.class, args);
	}

	@Bean
	CommandLineRunner run(
			RoleRepository roleRepository,
			UserRepository userRepository,
			FriendRepository friendRepository
			) {
		return args -> {
			roleRepository.save(new Role("USER"));
			roleRepository.save(new Role("ADMIN"));
			userRepository.save(new User(
					"Jindal",
					"Jindal@123"
			));
			userRepository.save(new User(
					"Ritesh",
					"Ritesh@123"
			));
			userRepository.save(new User(
					"Yash",
					"Yash@123"
			));
			userRepository.save(new User(
					"Meet",
					"Meet@123"
			));
			userRepository.save(new User(
					"Harsh",
					"Harsh@123"
			));
			User jindal = userRepository.findByUsername("Jindal").orElseThrow();
			User ritesh = userRepository.findByUsername("Ritesh").orElseThrow();
			User yash = userRepository.findByUsername("Yash").orElseThrow();
			User meet = userRepository.findByUsername("Meet").orElseThrow();
			friendRepository.save(
					new Friends(
							jindal.getUser_id(),
							ritesh.getUser_id(),
							jindal.getUsername(),
							ritesh.getUsername(),
							0L,
							0L,
							false
							)
			);
			friendRepository.save(
					new Friends(
							ritesh.getUser_id(),
							jindal.getUser_id(),
							ritesh.getUsername(),
							jindal.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							jindal.getUser_id(),
							yash.getUser_id(),
							jindal.getUsername(),
							yash.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							yash.getUser_id(),
							jindal.getUser_id(),
							yash.getUsername(),
							jindal.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							ritesh.getUser_id(),
							yash.getUser_id(),
							ritesh.getUsername(),
							yash.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							yash.getUser_id(),
							ritesh.getUser_id(),
							yash.getUsername(),
							ritesh.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							yash.getUser_id(),
							meet.getUser_id(),
							yash.getUsername(),
							meet.getUsername(),
							0L,
							0L,
							false
					)
			);
			friendRepository.save(
					new Friends(
							meet.getUser_id(),
							yash.getUser_id(),
							meet.getUsername(),
							yash.getUsername(),
							0L,
							0L,
							false
					)
			);
		};
	}
}
