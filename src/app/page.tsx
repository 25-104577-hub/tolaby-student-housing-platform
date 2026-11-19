import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/PropertyCard";

export default async function HomePage() {
  const [properties, universities] = await Promise.all([
    prisma.property.findMany({
      where: { status: "VERIFIED", availability: { not: "BOOKED" } },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 }, universities: { take: 1, include: { university: true } } },
    }),
    prisma.university.findMany(),
  ]);

  return (
    <main>
      <section className="border-b border-ink/10 bg-gradient-to-b from-brand-light/60 to-paper px-6 py-16 text-center">
        <span className="font-mono text-xs tracking-widest text-brand-deep uppercase">طلابـي · Tolaby</span>
        <h1 className="font-display text-4xl md:text-5xl font-black mt-3">سكنك الجامعي من غير سمسار</h1>
        <p className="text-ink/60 max-w-xl mx-auto mt-4">
          إعلانات سكن موثّقة، حجز محمي، شات آمن جوه المنصة، وعمولة واضحة من غير مفاجآت.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {universities.map((u) => (
            <span key={u.id} className="badge border-ink/15 text-ink/70">{u.name}</span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-extrabold mb-6">أحدث الإعلانات الموثّقة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              area={p.area}
              city={p.city}
              monthlyRent={Number(p.monthlyRent)}
              imageUrl={p.images[0]?.url}
              distanceKm={p.universities[0]?.distanceKm}
              etaMinutes={p.universities[0]?.etaMinutes}
            />
          ))}
          {properties.length === 0 && (
            <p className="text-ink/50 col-span-full text-center py-10">
              لسه مفيش إعلانات متاحة. شغّل <code>npm run prisma:seed</code> لإضافة بيانات تجريبية.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
