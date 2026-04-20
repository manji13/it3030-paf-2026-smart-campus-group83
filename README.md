# Smart Campus Operations Hub

Production-inspired university operations platform for SLIIT IT3030 PAF Assignment 2026.

## Tech Stack
- Backend: Java Spring Boot + Spring Security + Spring Data MongoDB
- Database: MongoDB
- Frontend: React (functional components + React Router + Axios)
- Authentication: Google OAuth2 outline + JWT API flow (with mock Google login for demo)
- CI: GitHub Actions

## Member Responsibility Mapping
- Member 1 (Backend/Frontend): Facilities & Assets Catalogue
- Member 2 (Backend/Frontend): Booking Management
- Member 3 (Backend/Frontend): Maintenance & Incident Ticketing
- Member 4 (Backend/Frontend): Notifications + Auth + Role Support

## Run Locally

### Backend
1. Go to `backend`
2. Set environment variables if needed:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. Run:
   - `mvn spring-boot:run`

Backend runs on `http://localhost:8000`.

### Frontend
1. Go to `frontend`
2. Run:
   - `npm install`
   - `npm start`

Frontend runs on `http://localhost:3000`.

## Folder Highlights
- Backend package root: `com.smartcampushub`
- Member-based backend layers:
  - `controller/member1..member4`
  - `service/member1..member4`
  - `repository/member1..member4`
  - `dto/member1..member4`
- Shared/core entities kept clean: `User`, `Notification`, `Resource`, `Booking`, `Ticket`
- Frontend structure includes:
  - `src/api`, `src/context`, `src/routes`, `src/layouts`, `src/pages/member1..member4`, `src/components/common`

## Documentation Index
- [Phased implementation notes](docs/PHASED_IMPLEMENTATION_NOTES.md)
- [API endpoints by member](docs/API_ENDPOINTS_BY_MEMBER.md)
- [MongoDB collections](docs/MONGODB_COLLECTIONS.md)
- [Branch strategy](docs/BRANCH_STRATEGY.md)
- [Role-based navigation menu](docs/ROLE_BASED_NAV_MENU.md)

## GitHub Actions
CI pipeline file:
- `.github/workflows/ci.yml`

It runs:
- Backend compile and tests
- Frontend install and production build

## Recommended Next Steps
1. Add real Google OAuth client credentials for live OAuth2 callback flow.
2. Add refresh token strategy and token revocation for stronger production auth.
3. Add integration tests (controller/service level) and API docs (OpenAPI/Swagger).
