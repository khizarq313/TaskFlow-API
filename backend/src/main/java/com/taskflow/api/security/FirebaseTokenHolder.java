package com.taskflow.api.security;

import lombok.*;

/**
 * Immutable holder for verified Firebase token claims.
 * Populated by FirebaseAuthFilter and stored in the SecurityContext.
 */
@Getter
@AllArgsConstructor
@Builder
public class FirebaseTokenHolder {

    private final String uid;
    private final String email;
    private final String name;
    private final String picture;
}
