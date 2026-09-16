package com.eventpass.dto.response;

import com.eventpass.model.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String name;
    private LocalDate eventDate;
    private Integer maxCapacity;
    private EventStatus status;
    private String organizerName;
    private boolean registeredByCurrentUser;
}
