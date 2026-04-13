package com.taskflow.api.service;

import com.taskflow.api.model.User;
import com.taskflow.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service layer for User management.
 * Handles auto-registration of users from Firebase Authentication tokens
 * and user profile retrieval.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * Finds or creates a user based on their Firebase UID.
     * Called on every authenticated request to ensure the user exists in the database.
     * On first request, the user is auto-registered with data from the verified JWT.
     *
     * @param firebaseUid the immutable UID from the verified Firebase token
     * @param email       the user's email from the token claims
     * @param displayName the user's display name (may be null)
     * @param photoUrl    the user's profile photo URL (may be null)
     * @return the existing or newly created User entity
     */
    @Transactional
    public User findOrCreateUser(String firebaseUid, String email, String displayName, String photoUrl) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .map(existingUser -> {
                    existingUser.setLastLoginAt(LocalDateTime.now());
                    if (displayName != null) {
                        existingUser.setDisplayName(displayName);
                    }
                    if (photoUrl != null) {
                        existingUser.setPhotoUrl(photoUrl);
                    }
                    log.debug("Existing user authenticated: {}", email);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .firebaseUid(firebaseUid)
                            .email(email)
                            .displayName(displayName != null ? displayName : email.split("@")[0])
                            .photoUrl(photoUrl)
                            .build();
                    log.info("Auto-registered new user from Firebase: {}", email);
                    return userRepository.save(newUser);
                });
    }

    /**
     * Retrieves a user by Firebase UID.
     *
     * @param firebaseUid the Firebase UID
     * @return the User entity
     * @throws IllegalArgumentException if no user exists with the given UID
     */
    @Transactional(readOnly = true)
    public User getUserByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found for Firebase UID: " + firebaseUid));
    }
}
