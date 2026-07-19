"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";

export function useSessionAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_ROUTES.checkAuth)
      .then((res) => setAuthenticated(Boolean(res.data?.data?.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      await axios.post(API_ROUTES.auth, { username, password });
      setAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await axios.post(API_ROUTES.logout);
    setAuthenticated(false);
  }, []);

  return { authenticated, loading, login, logout };
}
