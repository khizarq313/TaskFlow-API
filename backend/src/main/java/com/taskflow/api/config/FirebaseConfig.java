package com.taskflow.api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Initializes the Firebase Admin SDK on application startup.
 *
 * Supports three methods for loading Firebase credentials (in order of precedence):
 * 1. FIREBASE_SERVICE_ACCOUNT_JSON - Base64-encoded JSON string (recommended for production)
 * 2. FIREBASE_SERVICE_ACCOUNT_PATH - Path to JSON file
 * 3. FIREBASE_SERVICE_ACCOUNT_JSON_RAW - Raw JSON string
 *
 * This approach ensures no sensitive credentials are committed to version control.
 */
@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.service-account-json:}")
    private String serviceAccountJsonBase64;

    @Value("${firebase.service-account-path:}")
    private String serviceAccountPath;

    @Value("${firebase.service-account-json-raw:}")
    private String serviceAccountJsonRaw;

    @PostConstruct
    public void init() {
        if (FirebaseApp.getApps().isEmpty()) {
            try {
                InputStream serviceAccount = getServiceAccountStream();

                if (serviceAccount == null) {
                    log.error("Firebase credentials not configured. Set one of: FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_SERVICE_ACCOUNT_PATH, or FIREBASE_SERVICE_ACCOUNT_JSON_RAW");
                    throw new IllegalStateException("Firebase credentials not configured");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialized successfully");

            } catch (IOException e) {
                log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
                throw new RuntimeException("Firebase initialization failed", e);
            }
        }
    }

    private InputStream getServiceAccountStream() throws IOException {
        // Method 1: Base64-encoded JSON (recommended for production)
        if (serviceAccountJsonBase64 != null && !serviceAccountJsonBase64.isEmpty()) {
            try {
                byte[] decoded = Base64.getDecoder().decode(serviceAccountJsonBase64);
                log.info("Firebase initialized with base64-encoded credentials");
                return new ByteArrayInputStream(decoded);
            } catch (IllegalArgumentException e) {
                log.error("Invalid base64 encoding in FIREBASE_SERVICE_ACCOUNT_JSON");
                throw new IOException("Invalid base64 encoding", e);
            }
        }

        // Method 2: File path
        if (serviceAccountPath != null && !serviceAccountPath.isEmpty()) {
            log.info("Firebase initialized with file path credentials");
            return new FileInputStream(serviceAccountPath);
        }

        // Method 3: Raw JSON string
        if (serviceAccountJsonRaw != null && !serviceAccountJsonRaw.isEmpty()) {
            log.info("Firebase initialized with raw JSON credentials");
            return new ByteArrayInputStream(serviceAccountJsonRaw.getBytes(StandardCharsets.UTF_8));
        }

        return null;
    }
}
