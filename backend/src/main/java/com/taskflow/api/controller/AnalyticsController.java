package com.taskflow.api.controller;

import com.taskflow.api.dto.AnalyticsResponse;
import com.taskflow.api.model.User;
import com.taskflow.api.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for analytics and statistics endpoints.
 * Returns aggregated task data for the dashboard charts and stat cards.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Task analytics and performance metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get dashboard analytics",
            description = "Returns task statistics, completion trends, status distribution, and recent activity")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getAnalytics(user));
    }
}
