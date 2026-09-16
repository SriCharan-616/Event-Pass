package com.eventpass.service;

import com.eventpass.dto.request.CreateEventRequest;
import com.eventpass.dto.response.EventResponse;
import com.eventpass.dto.response.EventSummaryResponse;
import com.eventpass.dto.response.TopEventResponse;
import com.eventpass.exception.ApiException;
import com.eventpass.model.Event;
import com.eventpass.model.EventStatus;
import com.eventpass.model.Student;
import com.eventpass.repository.EventRepository;
import com.eventpass.repository.RegistrationRepository;
import com.eventpass.repository.StudentRepository;
import com.eventpass.repository.projection.EventRegistrationCount;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;

    public EventResponse createEvent(Long organizerId, CreateEventRequest request) {
        Student organizer = studentRepository.findById(organizerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Organizer not found"));

        Event event = new Event();
        event.setName(request.getName());
        event.setEventDate(request.getEventDate());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setStatus(EventStatus.OPEN);
        event.setOrganizer(organizer);

        Event saved = eventRepository.save(event);
        return toResponse(saved, null);
    }

    public List<EventResponse> listEvents(Long currentStudentId) {
        return eventRepository.findAllByOrderByEventDateAsc().stream()
                .map(event -> toResponse(event, currentStudentId))
                .toList();
    }

    public List<EventResponse> listEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId).stream()
                .map(event -> toResponse(event, null))
                .toList();
    }

    public EventSummaryResponse getEventSummary(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));

        long registeredCount = registrationRepository.countByEventId(eventId);
        long checkedInCount = registrationRepository.countByEventIdAndCheckedInTrue(eventId);

        return new EventSummaryResponse(event.getId(), event.getName(), event.getMaxCapacity(), registeredCount, checkedInCount);
    }

    public List<TopEventResponse> getTopEventsByRegistration() {
        List<EventRegistrationCount> rows = registrationRepository.findTopEventsByRegistrationCount();
        return rows.stream()
                .map(row -> new TopEventResponse(row.getEventId(), row.getEventName(), row.getTotalRegistrations()))
                .toList();
    }

    Event getEventOrThrow(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    private EventResponse toResponse(Event event, Long currentStudentId) {
        boolean registered = currentStudentId != null &&
                registrationRepository.existsByStudentIdAndEventId(currentStudentId, event.getId());
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getEventDate(),
                event.getMaxCapacity(),
                event.getStatus(),
                event.getOrganizer().getName(),
                registered
        );
    }
}
