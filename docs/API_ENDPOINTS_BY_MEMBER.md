# Recommended API Endpoint List (Grouped by Member)

## Member 1 - Facilities & Assets Catalogue
- `POST /api/v1/member1/resources` (ADMIN)
- `PUT /api/v1/member1/resources/{resourceId}` (ADMIN)
- `DELETE /api/v1/member1/resources/{resourceId}` (ADMIN)
- `GET /api/v1/member1/resources` (USER/ADMIN/TECHNICIAN)
- `GET /api/v1/member1/resources/{resourceId}` (USER/ADMIN/TECHNICIAN)

## Member 2 - Booking Management
- `POST /api/v1/member2/bookings` (USER/ADMIN)
- `GET /api/v1/member2/bookings/me` (USER/ADMIN)
- `GET /api/v1/member2/bookings/admin` (ADMIN)
- `PATCH /api/v1/member2/bookings/{bookingId}/decision` (ADMIN)
- `PATCH /api/v1/member2/bookings/{bookingId}/cancel` (USER/ADMIN)

## Member 3 - Maintenance & Incident Ticketing
- `POST /api/v1/member3/tickets` (USER/ADMIN/TECHNICIAN)
- `GET /api/v1/member3/tickets` (USER/ADMIN/TECHNICIAN)
- `GET /api/v1/member3/tickets/{ticketId}` (USER/ADMIN/TECHNICIAN)
- `PATCH /api/v1/member3/tickets/{ticketId}/assign` (ADMIN)
- `PATCH /api/v1/member3/tickets/{ticketId}/status` (ADMIN/TECHNICIAN)
- `PATCH /api/v1/member3/tickets/{ticketId}/resolution` (ADMIN/TECHNICIAN)
- `POST /api/v1/member3/tickets/{ticketId}/comments` (USER/ADMIN/TECHNICIAN)
- `PUT /api/v1/member3/tickets/{ticketId}/comments/{commentId}` (Owner/Admin)
- `DELETE /api/v1/member3/tickets/{ticketId}/comments/{commentId}` (Owner/Admin)

## Member 4 - Notifications + Auth
- `POST /api/v1/auth/google/mock` (Public)
- `GET /api/v1/auth/me` (USER/ADMIN/TECHNICIAN)
- `GET /api/v1/member4/notifications/me` (USER/ADMIN/TECHNICIAN)
- `PATCH /api/v1/member4/notifications/{notificationId}/read` (USER/ADMIN/TECHNICIAN)
- `PATCH /api/v1/member4/notifications/me/read-all` (USER/ADMIN/TECHNICIAN)
- `GET /api/v1/member4/notifications/me/unread-count` (USER/ADMIN/TECHNICIAN)
