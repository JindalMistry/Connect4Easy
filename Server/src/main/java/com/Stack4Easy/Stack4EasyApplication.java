package com.Stack4Easy;

import com.Stack4Easy.Application.Entity.Connections;
import com.Stack4Easy.Application.Repository.ConnRepository;
import com.Stack4Easy.Registration.Entity.Role;
import com.Stack4Easy.Registration.Entity.User;
import com.Stack4Easy.Registration.Repository.RoleRepository;
import com.Stack4Easy.Registration.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Stack4EasyApplication {
	public static void main(String[] args) {
		SpringApplication.run(Stack4EasyApplication.class, args);
	}

	@Bean
	CommandLineRunner run(
			RoleRepository roleRepository,
			UserRepository userRepository,
			ConnRepository connRepository
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
			userRepository.save(new User(
					"Dhrumil",
					"Dhrumil@123"
			));
			userRepository.save(new User(
					"Savan",
					"Savan@123"
			));
			userRepository.save(new User(
					"Naman",
					"Naman@123"
			));
			userRepository.save(new User(
					"Dixit",
					"Dixit@123"
			));
			userRepository.save(new User(
					"Mihir",
					"Mihir@123"
			));
//			User jindal = userRepository.findByUsername("Jindal").orElseThrow();
//			User ritesh = userRepository.findByUsername("Ritesh").orElseThrow();
//			User yash = userRepository.findByUsername("Yash").orElseThrow();
//			User meet = userRepository.findByUsername("Meet").orElseThrow();
//			connRepository.save(
//					new Connections(
//							jindal.getUser_id(),
//							ritesh.getUser_id(),
//							jindal.getUsername(),
//							ritesh.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//							)
//			);
//			connRepository.save(
//					new Connections(
//							ritesh.getUser_id(),
//							jindal.getUser_id(),
//							ritesh.getUsername(),
//							jindal.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							jindal.getUser_id(),
//							yash.getUser_id(),
//							jindal.getUsername(),
//							yash.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							yash.getUser_id(),
//							jindal.getUser_id(),
//							yash.getUsername(),
//							jindal.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							ritesh.getUser_id(),
//							yash.getUser_id(),
//							ritesh.getUsername(),
//							yash.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							yash.getUser_id(),
//							ritesh.getUser_id(),
//							yash.getUsername(),
//							ritesh.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							yash.getUser_id(),
//							meet.getUser_id(),
//							yash.getUsername(),
//							meet.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
//			connRepository.save(
//					new Connections(
//							meet.getUser_id(),
//							yash.getUser_id(),
//							meet.getUsername(),
//							yash.getUsername(),
//							0L,
//							0L,
//							false,
//							true
//					)
//			);
		};
	}
}
