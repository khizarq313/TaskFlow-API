package com.taskflow.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger configuration for auto-generated API documentation.
 * Accessible at /swagger-ui/index.html when the backend is running.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI taskFlowOpenAPI() {
        final String securitySchemeName = "Firebase JWT";

        return new OpenAPI()
                .info(new Info()
                        .title("TaskFlow API")
                        .description("RESTful backend API for TaskFlow — a full-stack task management system. "
                                + "Built with Java Spring Boot following a clean, layered architecture "
                                + "(Controller → Service → Repository). All endpoints require Firebase "
                                + "Authentication via Bearer token.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("TaskFlow Team")
                                .url("https://github.com/your-org/taskflow-api"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Firebase ID token obtained from the React frontend")));
    }
}
