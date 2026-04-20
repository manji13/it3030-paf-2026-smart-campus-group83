# Suggested GitHub Branch Strategy (4 Members)

## Main Branches
- `main`: stable integration branch.
- `develop`: optional integration branch for sprint-level merges.

## Member Feature Branches
- `feature/member1-resource-catalog`
- `feature/member2-booking-management`
- `feature/member3-ticketing`
- `feature/member4-auth-notification`

## Work Pattern
1. Each member works on their own feature branch.
2. Open PR to `develop` (or `main` for simple workflow).
3. Require at least one peer review.
4. Merge only after CI passes.
5. Tag milestone releases (e.g., `v0.1-phase2`, `v1.0-final`).

## Hotfix Pattern
- `hotfix/<issue-key-or-short-description>` from `main`, then merge back.
