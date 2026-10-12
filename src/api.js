// Base URL of the Spring Boot backend.
// Local: http://localhost:8080   |   Deployed: set VITE_API_URL in Vercel
export const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Every request to our backend automatically carries the login token:
//   students -> Authorization: Bearer <token>
//   admin    -> X-Admin-Token: <token>
const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;

  if (url && url.startsWith(API)) {
    const headers = new Headers(init.headers || {});

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const admin = JSON.parse(localStorage.getItem("admin") || "null");

      if (user && user.token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${user.token}`);
      }
      if (admin && admin.token) {
        headers.set("X-Admin-Token", admin.token);
      }
    } catch (error) {
      // ignore broken localStorage data
    }

    return originalFetch(input, { ...init, headers });
  }

  return originalFetch(input, init);
};
