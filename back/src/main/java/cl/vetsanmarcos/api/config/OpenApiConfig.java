package cl.vetsanmarcos.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API Veterinaria San Marcos",
        version = "1.0.0",
        description = "Servicios REST para la clínica Veterinaria San Marcos. Permite administrar el catálogo y las solicitudes de atención, además de gestionar productos, clientes y ventas. Las rutas protegidas requieren un token JWT válido.",
        contact = @Contact(name = "Veterinaria San Marcos")
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER,
    description = "Inicia sesión y pega aquí el token JWT recibido, sin agregar el prefijo Bearer."
)
public class OpenApiConfig {}
