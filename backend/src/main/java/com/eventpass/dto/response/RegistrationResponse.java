package com.eventpass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RegistrationResponse {
    private Long registrationId;
    private Long eventId;
    private String eventName;
    private LocalDate eventDate;
    private boolean checkedIn;
    private LocalDateTime registeredAt;
}
