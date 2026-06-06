export const SITE_URL = "https://ttautosengineering.com";

export function canonical(pathname: string) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean}`;
}