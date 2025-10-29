/**
 * Provider de autenticación
 */
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { access_token } = response;
      
      localStorage.setItem('token', access_token);
      
      // Obtener información del usuario
      const userInfo = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  const isEditor = () => {
    return user?.rol === 'editor' || user?.rol === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isEditor,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}