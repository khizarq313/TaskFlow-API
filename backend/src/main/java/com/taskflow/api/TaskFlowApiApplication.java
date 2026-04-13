package com.taskflow.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the TaskFlow API — a RESTful task management backend
 * built with Spring Boot following a strict Controller → Service → Repository
 * layered architecture.
 */
@SpringBootApplication
public class TaskFlowApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskFlowApiApplication.class, args);
    }
}
