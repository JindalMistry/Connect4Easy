package com.Stack4Easy.Security;

import com.Stack4Easy.Registration.Entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {
    private static String SECRET_KEY = "";

    public void createSecretKey(){
        if(SECRET_KEY.isEmpty()) {
            Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            SECRET_KEY = Encoders.BASE64.encode(key.getEncoded());
        }
    }

    public String extractUserMain(String token){
        return extractClaim(token, Claims::getSubject);
    }
    public String generateToken(
            Map<String, Object> extraClaims,
            User appUser
    ){
        createSecretKey();
        String subject = appUser.getUsername();
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * 24)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(User appUser){
        return generateToken(new HashMap<>(), appUser);
    }
    public Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public Boolean IsTokenValid(String token, User appUser){
        Boolean IsTokenExpired = IsTokenExpired(token);
        String extractedUserMain = extractClaim(token, Claims::getSubject);
        String userMain = appUser.getUsername();
        return (userMain.equals(extractedUserMain) && !IsTokenExpired);
    }

    public Boolean IsTokenExpired(String token){
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}