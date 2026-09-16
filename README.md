# Event Pass Management System

A college event registration/check-in system. Organizers create events; students register, cancel, and check in on the event day.

## Stack

- **Backend**: Spring Boot 3 (Java 17), Spring Security + JWT, Spring Data JPA. Defaults to an embedded H2 file database for zero-setup local runs; swap to MySQL/PostgreSQL via env vars.
- **Frontend**: React + Vite + TypeScript, React Router, Axios.

## Running locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`. Data persists to `backend/data/eventpass.mv.db` (H2 file) by default.

To point at MySQL/PostgreSQL instead, set before running:

```bash
export DB_URL="jdbc:mysql://localhost:3306/eventpass"
export DB_USER="root"
export DB_PASSWORD="yourpassword"
```

(Also add the appropriate driver dependency in `pom.xml` if switching to Postgres — MySQL's is already included.)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` calls to the backend on port 8080.

## Roles

- **Organizer**: create events, view per-event summary (capacity / registered / checked-in), view the top-events-by-registration report.
- **Participant**: browse events, register (blocked once full or if already registered), cancel (blocked after check-in), check in on the event day, view registrations and event summaries.

## API overview

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account (organizer or participant) |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/events` | Create event (organizer only) |
| GET | `/api/events` | List all events |
| GET | `/api/events/mine` | List the logged-in organizer's events |
| GET | `/api/events/{id}/summary` | Event summary (capacity/registered/checked-in) |
| GET | `/api/events/top` | Top events by registration count, descending |
| POST | `/api/events/{id}/register` | Register for an event |
| DELETE | `/api/events/{id}/register` | Cancel a registration |
| POST | `/api/events/{id}/checkin` | Check in to an event |
| GET | `/api/registrations/me` | The logged-in participant's registrations |
