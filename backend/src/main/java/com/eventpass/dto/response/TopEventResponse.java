package com.eventpass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopEventResponse {
    private Long eventId;
    private String eventName;
    private long totalRegistrations;
}
