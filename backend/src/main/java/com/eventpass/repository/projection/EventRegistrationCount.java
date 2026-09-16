package com.eventpass.repository.projection;

public interface EventRegistrationCount {
    Long getEventId();
    String getEventName();
    Long getTotalRegistrations();
}
