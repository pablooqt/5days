export function formatDeviceLabel(id: string) {
  return id
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
