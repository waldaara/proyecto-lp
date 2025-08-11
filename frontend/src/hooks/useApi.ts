import { useState, useCallback } from 'react';
import { ApiError, handleApiError } from '../services/apiUtils';

// Estado de la API
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Hook para manejar llamadas a la API
export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Función para ejecutar una llamada a la API
  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const apiError = handleApiError(error);
      setState({ data: null, loading: false, error: apiError });
      throw apiError;
    }
  }, []);

  // Función para resetear el estado
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Función para establecer datos manualmente
  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  // Función para establecer un error manualmente
  const setError = useCallback((error: ApiError) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

// Hook para manejar listas de datos
export function useApiList<T>() {
  const [state, setState] = useState<ApiState<T[]>>({
    data: [],
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T[]>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const apiError = handleApiError(error);
      setState({ data: [], loading: false, error: apiError });
      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: [], loading: false, error: null });
  }, []);

  const setData = useCallback((data: T[]) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setError = useCallback((error: ApiError) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  // Función para agregar un elemento a la lista
  const addItem = useCallback((item: T) => {
    setState(prev => ({ 
      ...prev, 
      data: [...prev.data, item],
      error: null 
    }));
  }, []);

  // Función para actualizar un elemento en la lista
  const updateItem = useCallback((id: number, updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: prev.data.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      ),
      error: null
    }));
  }, []);

  // Función para eliminar un elemento de la lista
  const removeItem = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      data: prev.data.filter(item => (item as any).id !== id),
      error: null
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    addItem,
    updateItem,
    removeItem,
  };
}

