package com.eventpass.repository;

import com.eventpass.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByEventDateAsc();
    List<Event> findByOrganizerId(Long organizerId);
}
