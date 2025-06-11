"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
}

export interface DataStateActions<T> {
  setData: (data: T[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsEditing: (editing: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  refetch: () => Promise<void>;
  handleEdit: () => void;
  handleSave: (saveFunction: () => Promise<void>) => Promise<void>;
  handleCancel: () => void;
}

export interface UseDataStateOptions<T> {
  fetchFunction: () => Promise<T[]>;
  autoFetch?: boolean;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
}

export function useDataState<T>({
  fetchFunction,
  autoFetch = true,
  onSaveSuccess,
  onSaveError
}: UseDataStateOptions<T>): [DataState<T>, DataStateActions<T>] {
  const [data, setData] = useState<T[]>([]);
  const [originalData, setOriginalData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialMountRef = useRef(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
      setOriginalData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
  }, []);

  const handleSave = useCallback(async (saveFunction: () => Promise<void>) => {
    setIsSaving(true);
    setError(null);
    try {
      await saveFunction();
      setIsEditing(false);
      setOriginalData([...data]);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Save failed';
      setError(errorMessage);
      if (onSaveError) {
        onSaveError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  }, [data, onSaveSuccess, onSaveError]);

  const handleCancel = useCallback(() => {
    setData([...originalData]);
    setIsEditing(false);
    setError(null);
  }, [originalData]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && initialMountRef.current) {
      initialMountRef.current = false;
      refetch();
    }
  }, [autoFetch, refetch]);

  const state: DataState<T> = {
    data,
    loading,
    error,
    isEditing,
    isSaving
  };

  const actions: DataStateActions<T> = {
    setData,
    setLoading,
    setError,
    setIsEditing,
    setIsSaving,
    refetch,
    handleEdit,
    handleSave,
    handleCancel
  };

  return [state, actions];
}
