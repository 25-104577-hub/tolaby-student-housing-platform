"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(fd.entries())) });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error || "حصل خطأ"); return; }
    const data = await res.json();
    router.push(data.role === "STUDENT" ? "/dashboard/student" : data.role === "OWNER" ? "/dashboard/owner" : "/dashboard/admin");
  }

  return (
    <main className="max-w-md mx-auto px-6 py-14">
      <h1 className="font-display text-2xl font-black mb-6">تسجيل دخول</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="الإيميل" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        <input name="password" type="password" required placeholder="كلمة السر" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        {error && <p className="text-warn text-sm">{error}</p>}
        <button disabled={loading} className="btn btn-brand w-full">{loading ? "..." : "دخول"}</button>
      </form>
    </main>
  );
}
