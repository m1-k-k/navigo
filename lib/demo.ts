export const DEMO_ORIGIN = "King's Cross, London";
export const DEMO_DESTINATION = "Camden Town, London";
export const DEMO_LOCATION = { lat: 51.5308, lng: -0.1238 };

export function isDemoModeFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function isDemoModeFromSearch(search: string | null): boolean {
  return search === "1" || search === "true";
}

export function isDemoMode(searchParams?: { get: (key: string) => string | null }): boolean {
  if (isDemoModeFromEnv()) return true;
  if (searchParams) return isDemoModeFromSearch(searchParams.get("demo"));
  if (typeof window !== "undefined") {
    return isDemoModeFromSearch(new URLSearchParams(window.location.search).get("demo"));
  }
  return false;
}

/** Demo mode forces daytime so Fast vs Safe toggle works on stage */
export function effectiveIsNightTime(isNight: boolean, demo: boolean): boolean {
  return demo ? false : isNight;
}
