"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <div className="flex min-h-dvh items-center justify-center p-5">
      <form
        action={action}
        className="card w-full max-w-sm p-8"
        autoComplete="off"
      >
        <h1 className="h-display text-xl">Вхід в адмінку</h1>
        <p className="text-muted mt-1 text-sm">
          Доступ лише для адміністраторів сайту.
        </p>

        <label className="mt-6 block">
          <span className="mb-1 block text-sm font-medium">Логін</span>
          <input name="login" className="input" autoComplete="username" />
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Пароль</span>
          <input
            name="password"
            type="password"
            className="input"
            autoComplete="current-password"
          />
        </label>

        {state.error && (
          <p className="mt-3 text-sm" style={{ color: "#e23b3b" }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={pending}
        >
          {pending ? "Вхід…" : "Увійти"}
        </button>
      </form>
    </div>
  );
}
