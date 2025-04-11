// src/api/authService.ts

export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🧠 This is *critical* for cookies to be stored
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        console.error('❌ Login failed:', await res.text());
        return false;
      }
  
      console.log('✅ Login successful!');
      return true;
    } catch (err) {
      console.error('❌ Login error:', err);
      return false;
    }
  };
  
  export const getUserIdFromBackend = async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/user', {
        credentials: 'include',
      });
  
      if (!res.ok) {
        console.warn('⚠️ Backend responded with status', res.status, 'when fetching userId');
        return null;
      }
  
      return await res.text(); // assuming your backend returns just the user ID string
    } catch (err) {
      console.error('❌ Error fetching userId:', err);
      return null;
    }
  };
  