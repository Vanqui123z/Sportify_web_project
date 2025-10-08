
// utils/auth.ts


export async function checkLogin(): Promise<{ loggedIn: boolean, username?: string, role?: string }> {
  try {
    const response = await fetch("http://localhost:8081/api/user/rest/security/authentication", {
      method: "GET",
      credentials: "include" 
    });
    
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
