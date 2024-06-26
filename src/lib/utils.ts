export function appURL() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  } else {
    const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return url;
  }
}
