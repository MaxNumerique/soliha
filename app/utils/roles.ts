export function hasRole(userRoles: string[], requiredRoles: string | string[]) {
  if (!userRoles) return false;
  return Array.isArray(requiredRoles)
    ? userRoles.some(role => requiredRoles.includes(role))
    : userRoles.includes(requiredRoles);
}
