import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    
    setAuth: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
        set({ user, isAuthenticated: true });
    },
    
    logout: () => {
        localStorage.clear();
        set({ user: null, isAuthenticated: false });
    }
}));