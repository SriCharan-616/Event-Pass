package com.eventpass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EventSummaryResponse {
    private Long eventId;
    private String eventName;
    private Integer maxCapacity;
    private long registeredCount;
    private long checkedInCount;
}
