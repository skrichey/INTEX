// src/api/authService.ts

const BASE_URL = 'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ Critical for cookie auth
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
    const res = await fetch(`${BASE_URL}/api/auth/user`, {
      credentials: 'include',
    });

    if (!res.ok) {
      console.warn('⚠️ Backend responded with status', res.status, 'when fetching userId');
      return null;
    }

    return await res.text(); // Backend should return plain userId
  } catch (err) {
    console.error('❌ Error fetching userId:', err);
    return null;
  }
};
