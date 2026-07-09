const LONDON_TZ = "Europe/London";

export function isNightTime(date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: LONDON_TZ,
      hour: "numeric",
      hour12: false,
    }).format(date)
  );
  return hour < 6 || hour >= 18;
}

export function getTimeOfDayLabel(date = new Date()): string {
  return isNightTime(date) ? "Night — Safe routes active" : "Day — Choose your route";
}
