
// utils/auth.ts

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

export async function checkLogin(): Promise<{ loggedIn: boolean, username?: string, role?: string }> {
  try {
    const response = await fetch(`${URL_BACKEND}/api/user/rest/security/authentication`, {
      method: "GET",
      credentials: "include"
    });
    console.log("checkLogin response:", `${URL_BACKEND}/api/user/rest/security/authentication`);

    if (!response.ok) {
      return { loggedIn: false };
    }

    const data = await response.json();
    return {
      loggedIn: data.loggedIn,
      username: data.username,
      role: data.roles.roles.rolename,

    };
  } catch (error) {
    console.error("Error checking login:", error);
    return { loggedIn: false }; // network error → coi như chưa đăng nhập
  }
}
