package com.eventpass.controller;

import com.eventpass.dto.response.RegistrationResponse;
import com.eventpass.security.UserPrincipal;
import com.eventpass.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/api/events/{eventId}/register")
    public ResponseEntity<RegistrationResponse> register(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.register(principal.getId(), eventId));
    }

    @DeleteMapping("/api/events/{eventId}/register")
    public ResponseEntity<Void> cancel(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long eventId) {
        registrationService.cancel(principal.getId(), eventId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/events/{eventId}/checkin")
    public ResponseEntity<RegistrationResponse> checkIn(@AuthenticationPrincipal UserPrincipal principal,
                                                          @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.checkIn(principal.getId(), eventId));
    }

    @GetMapping("/api/registrations/me")
    public ResponseEntity<List<RegistrationResponse>> myRegistrations(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(registrationService.listMyRegistrations(principal.getId()));
    }
}
