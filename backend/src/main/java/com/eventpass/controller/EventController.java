package com.eventpass.controller;

import com.eventpass.dto.request.CreateEventRequest;
import com.eventpass.dto.response.EventResponse;
import com.eventpass.dto.response.EventSummaryResponse;
import com.eventpass.dto.response.TopEventResponse;
import com.eventpass.exception.ApiException;
import com.eventpass.model.Role;
import com.eventpass.security.UserPrincipal;
import com.eventpass.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@AuthenticationPrincipal UserPrincipal principal,
                                                       @Valid @RequestBody CreateEventRequest request) {
        requireOrganizer(principal);
        return ResponseEntity.ok(eventService.createEvent(principal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> listEvents(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(eventService.listEvents(principal.getId()));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<EventResponse>> listMyEvents(@AuthenticationPrincipal UserPrincipal principal) {
        requireOrganizer(principal);
        return ResponseEntity.ok(eventService.listEventsByOrganizer(principal.getId()));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<EventSummaryResponse> getSummary(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventSummary(id));
    }

    @GetMapping("/top")
    public ResponseEntity<List<TopEventResponse>> getTopEvents() {
        return ResponseEntity.ok(eventService.getTopEventsByRegistration());
    }

    private void requireOrganizer(UserPrincipal principal) {
        if (principal.getRole() != Role.ORGANIZER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only organizers can perform this action");
        }
    }
}
