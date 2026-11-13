package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Servicio;
import cl.vetsanmarcos.api.model.Usuario;
import cl.vetsanmarcos.api.repository.ServicioRepository;
import cl.vetsanmarcos.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BootstrapData implements CommandLineRunner {
    private final UsuarioRepository usuarios; private final ServicioRepository servicios; private final PasswordEncoder encoder;
    @Value("${DEMO_ADMIN_PASSWORD:Admin123}") private String adminPassword;
    @Value("${DEMO_VET_PASSWORD:Vet2026}") private String vetPassword;
    BootstrapData(UsuarioRepository usuarios,ServicioRepository servicios,PasswordEncoder encoder){this.usuarios=usuarios;this.servicios=servicios;this.encoder=encoder;}
    @Override public void run(String... args){
        if(!usuarios.existsByCorreoIgnoreCase("admin@vetsanmarcos.cl")) usuarios.save(new Usuario("Administrador","San Marcos","admin@vetsanmarcos.cl",encoder.encode(adminPassword),"admin",null,null,null,null));
        if(!usuarios.existsByCorreoIgnoreCase("veterinario@vetsanmarcos.cl")) usuarios.save(new Usuario("Veterinario","San Marcos","veterinario@vetsanmarcos.cl",encoder.encode(vetPassword),"veterinario",null,null,null,null));
        if(servicios.count()==0){servicios.save(new Servicio("Consulta General","Para saber cómo está tu animalito.",18000,"Todas","/img/perro en clinica.jpg"));servicios.save(new Servicio("Vacunación","Las vacunas al día para que no se enferme.",12000,"Perros y gatos","/img/gato vacuna.jpg"));servicios.save(new Servicio("Cirugía Menor","Procedimientos rápidos y seguros para tu mascota.",35000,"Todas","/img/wonejo.jpg"));}
    }
}
