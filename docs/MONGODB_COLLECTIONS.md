# Suggested MongoDB Collections

- `users`
  - Stores profile, provider, role set, and login metadata.
- `resources`
  - Facilities and assets catalogue.
- `bookings`
  - Booking requests and approval lifecycle.
- `tickets`
  - Maintenance/incident tickets with embedded comments and attachment metadata.
- `notifications`
  - User notification feed.

## Embedding Strategy (Academic-Friendly)
- Ticket comments are embedded inside `tickets` for simpler viva explanation.
- Ticket attachments are embedded inside `tickets` as metadata objects.
