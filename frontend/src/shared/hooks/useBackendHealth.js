import { useEffect, useState } from "react";
import { fetchHealth } from "../api/health";

export function useBackendHealth() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setHealth(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setHealth(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { health, error, loading };
}
