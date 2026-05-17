"use client";

import { useState } from "react";

export default function MediaUploader() {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    setUrl(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "fail");
      setUrl(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Помилка завантаження");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">
          Завантажити зображення (jpg/png/webp/gif, до 6 МБ)
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          disabled={busy}
        />
      </label>
      {busy && <p className="text-muted mt-3 text-sm">Завантаження…</p>}
      {err && (
        <p className="mt-3 text-sm" style={{ color: "#e23b3b" }}>
          {err}
        </p>
      )}
      {url && (
        <div className="mt-4">
          <p className="text-sm font-medium">Готово. URL для вставлення:</p>
          <input className="input mt-2" readOnly value={url} />
        </div>
      )}
    </div>
  );
}
