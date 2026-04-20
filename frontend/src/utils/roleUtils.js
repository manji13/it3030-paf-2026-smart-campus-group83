export function hasRole(user, role) {
  return (user?.roles || []).includes(role);
}

export function hasAnyRole(user, roles = []) {
  return roles.some((role) => hasRole(user, role));
}
