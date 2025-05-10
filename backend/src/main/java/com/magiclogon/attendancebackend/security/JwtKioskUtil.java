package com.magiclogon.attendancebackend.security;

import com.magiclogon.attendancebackend.model.Entreprise;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtKioskUtil {

    @Value("${security.jwt.secret-key}")
    private String kioskSecretKey;

    @Value("${security.jwt.expiration-time}")
    private Long kioskExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = kioskSecretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Create token
    public String generateToken(Entreprise entreprise) {
        return Jwts.builder()
                .setSubject("kiosk")
                .claim("companyId", entreprise.getId())
                .claim("cameraCode", entreprise.getCameraCode())
                .claim("type", "KIOSK")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + kioskExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // General claim extractor
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    // Specific extractors
    public Integer extractCompanyId(String token) {
        return extractClaim(token, claims -> ((Number) claims.get("companyId")).intValue());
    }

    public String extractCameraCode(String token) {
        return extractClaim(token, claims -> claims.get("cameraCode", String.class));
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public boolean isKioskToken(String token) {
        return "KIOSK".equals(extractClaim(token, claims -> claims.get("type", String.class)));
    }

    public boolean validateToken(String token) {
        return !isTokenExpired(token) && isKioskToken(token);
    }
}
