"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "jaeteck-radar-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWatchlist(JSON.parse(stored) as string[]);
    } catch {
      // localStorage 접근 불가 환경 무시
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setWatchlist(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* noop */ }
  }, []);

  const add    = useCallback((ticker: string) => {
    persist([...watchlist.filter((t) => t !== ticker), ticker]);
  }, [watchlist, persist]);

  const remove = useCallback((ticker: string) => {
    persist(watchlist.filter((t) => t !== ticker));
  }, [watchlist, persist]);

  const toggle = useCallback((ticker: string) => {
    if (watchlist.includes(ticker)) remove(ticker);
    else add(ticker);
  }, [watchlist, add, remove]);

  return {
    watchlist,
    ready,
    add,
    remove,
    toggle,
    isWatching: (ticker: string) => watchlist.includes(ticker),
  };
}
