package cl.vetsanmarcos.api.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configuración de seguridad de la API.
 *
 * - Autenticación sin sesión (STATELESS): cada petición debe traer el header
 *   "Authorization: Bearer <token>".
 * - El token JWT se firma con HMAC-SHA256 usando la clave JWT_SECRET.
 * - Los roles viajan dentro del token en el claim "roles" (USER, ADMIN, VETERINARIO).
 *   Spring les agrega el prefijo ROLE_, por eso aquí se usa hasRole("ADMIN").
 */
@Configuration
public class SecurityConfig {

    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";
    public static final String VETERINARIO = "VETERINARIO";

    // ---------- JWT ----------

    @Bean
    SecretKey jwtKey(@Value("${app.jwt.secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 caracteres");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    /** Se usa en AuthController para CREAR tokens al iniciar sesión. */
    @Bean
    JwtEncoder jwtEncoder(SecretKey key) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(key));
    }

    /** Se usa en cada petición para VALIDAR la firma y la expiración del token. */
    @Bean
    JwtDecoder jwtDecoder(SecretKey key) {
        return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
    }

    /** Las contraseñas se guardan en MySQL cifradas con BCrypt, nunca en texto plano. */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** Convierte el claim "roles" del token en autoridades ROLE_ADMIN, ROLE_USER, etc. */
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    // ---------- CORS (permite que React en otro puerto llame a la API) ----------

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") String origins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(origins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ---------- Reglas de acceso por rol ----------

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter converter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Público: login, registro, Swagger y salud del servidor
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health", "/error").permitAll()

                // Servicios: cualquiera puede verlos, solo ADMIN los modifica
                .requestMatchers(HttpMethod.GET, "/api/v1/servicios/**").permitAll()
                .requestMatchers("/api/v1/servicios/**").hasRole(ADMIN)

                // Productos y mascotas: usuarios logueados ven, solo ADMIN crea/edita/elimina
                .requestMatchers(HttpMethod.GET, "/api/v1/productos/**", "/api/v1/mascotas/**").authenticated()
                .requestMatchers("/api/v1/productos/**", "/api/v1/mascotas/**").hasRole(ADMIN)

                // Clientes y ventas: información sensible, solo ADMIN
                .requestMatchers("/api/v1/clientes/**", "/api/v1/ventas/**").hasRole(ADMIN)

                // Solicitudes: cambiar el estado solo VETERINARIO o ADMIN
                .requestMatchers(HttpMethod.PATCH, "/api/v1/solicitudes/**").hasAnyRole(VETERINARIO, ADMIN)

                // Todo lo demás requiere estar logueado
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(jwt -> jwt.jwtAuthenticationConverter(converter)));
        return http.build();
    }
}
