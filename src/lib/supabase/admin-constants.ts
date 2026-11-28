export const MERKORA_ADMIN_EMAIL = "merkoragdj@gmail.com";

export function isMerkoraAdminEmail(value: string | null | undefined): boolean {
  return value?.trim().toLowerCase() === MERKORA_ADMIN_EMAIL;
}
