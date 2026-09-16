package com.eventpass.service;

import com.eventpass.dto.response.RegistrationResponse;
import com.eventpass.exception.ApiException;
import com.eventpass.model.Event;
import com.eventpass.model.EventStatus;
import com.eventpass.model.Registration;
import com.eventpass.model.Student;
import com.eventpass.repository.RegistrationRepository;
import com.eventpass.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final EventService eventService;

    @Transactional
    public RegistrationResponse register(Long studentId, Long eventId) {
        Event event = eventService.getEventOrThrow(eventId);

        if (event.getStatus() != EventStatus.OPEN) {
            throw new ApiException(HttpStatus.CONFLICT, "This event is not open for registration");
        }

        if (registrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new ApiException(HttpStatus.CONFLICT, "You are already registered for this event");
        }

        long currentCount = registrationRepository.countByEventId(eventId);
        if (currentCount >= event.getMaxCapacity()) {
            throw new ApiException(HttpStatus.CONFLICT, "This event is full");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));

        Registration registration = new Registration();
        registration.setStudent(student);
        registration.setEvent(event);
        registration.setCheckedIn(false);

        Registration saved = registrationRepository.save(registration);
        return toResponse(saved);
    }

    @Transactional
    public void cancel(Long studentId, Long eventId) {
        Registration registration = registrationRepository.findByStudentIdAndEventId(studentId, eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "You are not registered for this event"));

        if (registration.isCheckedIn()) {
            throw new ApiException(HttpStatus.CONFLICT, "Cannot cancel a registration after checking in");
        }

        registrationRepository.delete(registration);
    }

    @Transactional
    public RegistrationResponse checkIn(Long studentId, Long eventId) {
        Registration registration = registrationRepository.findByStudentIdAndEventId(studentId, eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "You are not registered for this event"));

        if (registration.isCheckedIn()) {
            throw new ApiException(HttpStatus.CONFLICT, "You have already checked in to this event");
        }

        registration.setCheckedIn(true);
        Registration saved = registrationRepository.save(registration);
        return toResponse(saved);
    }

    public List<RegistrationResponse> listMyRegistrations(Long studentId) {
        return registrationRepository.findByStudentIdOrderByRegisteredAtDesc(studentId).stream()
                .map(this::toResponse)
                .toList();
    }

    private RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getName(),
                registration.getEvent().getEventDate(),
                registration.isCheckedIn(),
                registration.getRegisteredAt()
        );
    }
}
