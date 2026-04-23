export function validateLicense(key: string) {
  if (!key || key.length < 16) return { valid: false, message: "License format invalid" };
  return { valid: true, message: "License accepted (local validation)" };
}
