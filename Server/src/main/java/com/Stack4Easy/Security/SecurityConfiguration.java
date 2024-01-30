package com.Stack4Easy.Security;
import com.Stack4Easy.Registration.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .headers((opt) -> {
                    opt.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable);
                })
                .cors(cors -> {
                                cors.configurationSource(source -> {
                                    CorsConfiguration config = new CorsConfiguration();
                                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://192.168.100.43:3000"));
                                    config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE"));
                                    config.setAllowedHeaders(Arrays.asList("*"));
                                    config.setAllowCredentials(true);
                                    return config;
                                });
                })
                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers("/auth/**", "/ws/**", "/ws","/h2-console","/h2-console/**").permitAll()
                            .anyRequest()
                            .permitAll();
//                            .authenticated();
                })
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }
}
