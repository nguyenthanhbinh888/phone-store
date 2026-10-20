package com.phonestore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI phoneStoreOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Phone Store REST API")
                        .description("REST API documentation for Phone Store e-commerce platform")
                        .version("1.0.0")
                        .contact(new Contact().name("Phone Store Team"))
                        .license(new License().name("Apache 2.0")));
    }
}
