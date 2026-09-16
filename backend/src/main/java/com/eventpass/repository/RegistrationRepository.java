package com.eventpass.repository;

import com.eventpass.model.Registration;
import com.eventpass.repository.projection.EventRegistrationCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    long countByEventId(Long eventId);

    long countByEventIdAndCheckedInTrue(Long eventId);

    List<Registration> findByStudentIdOrderByRegisteredAtDesc(Long studentId);

    @Query("select r.event.id as eventId, r.event.name as eventName, count(r) as totalRegistrations " +
            "from Registration r group by r.event.id, r.event.name order by count(r) desc")
    List<EventRegistrationCount> findTopEventsByRegistrationCount();
}
