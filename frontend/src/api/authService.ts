// src/api/authService.ts
export const getUserIdFromBackend = async (): Promise<string | null> => {
    try {
      const res = await fetch('https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api/auth/user', {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return await res.text(); // Assuming backend just returns userId as string
    } catch {
      return null;
    }
  };
  