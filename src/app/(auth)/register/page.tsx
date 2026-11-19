"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "OWNER">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { role, ...Object.fromEntries(fd.entries()) };
    if (body.academicYear) body.academicYear = Number(body.academicYear);

    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(typeof d.error === "string" ? d.error : "حصل خطأ، راجع البيانات"); return; }
    router.push(role === "STUDENT" ? "/dashboard/student" : "/dashboard/owner");
  }

  return (
    <main className="max-w-md mx-auto px-6 py-14">
      <h1 className="font-display text-2xl font-black mb-6">إنشاء حساب في طلابي</h1>
      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setRole("STUDENT")} className={`btn ${role === "STUDENT" ? "btn-brand" : "btn-outline"} flex-1`}>طالب</button>
        <button type="button" onClick={() => setRole("OWNER")} className={`btn ${role === "OWNER" ? "btn-brand" : "btn-outline"} flex-1`}>صاحب سكن</button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="fullName" required placeholder="الاسم الكامل" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        <input name="email" type="email" required placeholder="الإيميل" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        <input name="phone" required placeholder="رقم الموبايل" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        <input name="password" type="password" required minLength={8} placeholder="كلمة السر (8 أحرف على الأقل)" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
        {role === "STUDENT" && (
          <>
            <input name="university" required placeholder="الجامعة" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
            <input name="faculty" placeholder="الكلية (اختياري)" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
            <input name="academicYear" type="number" placeholder="الفرقة الدراسية (اختياري)" className="w-full border border-ink/15 rounded-xl2 px-4 py-2.5" />
          </>
        )}
        {error && <p className="text-warn text-sm">{error}</p>}
        <button disabled={loading} className="btn btn-brand w-full">{loading ? "جاري الإنشاء..." : "إنشاء الحساب"}</button>
      </form>
    </main>
  );
}
