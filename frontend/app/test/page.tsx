"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/axios";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/test")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>API Test</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
