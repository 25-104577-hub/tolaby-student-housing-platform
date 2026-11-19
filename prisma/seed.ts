import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- Platform settings (singleton) ----------
  await prisma.platformSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // ---------- Universities (demo, real coordinates) ----------
  const universities = await Promise.all([
    prisma.university.create({
      data: { name: "الجامعة الأمريكية بالقاهرة (AUC)", city: "القاهرة الجديدة", latitude: 30.0189, longitude: 31.4996 },
    }),
    prisma.university.create({
      data: { name: "جامعة العاصمة للمعلوماتية (EUI)", city: "العاصمة الإدارية", latitude: 30.0131, longitude: 31.7269 },
    }),
    prisma.university.create({
      data: { name: "الجامعة الألمانية بالقاهرة (GUC)", city: "القاهرة الجديدة", latitude: 29.9944, longitude: 31.4413 },
    }),
    prisma.university.create({
      data: { name: "جامعة القاهرة", city: "الجيزة", latitude: 30.0284, longitude: 31.2114 },
    }),
  ]);

  // ---------- Demo owner ----------
  const ownerUser = await prisma.user.create({
    data: {
      email: "owner-demo@tolaby.test",
      passwordHash: await bcrypt.hash("Password123!", 10),
      phone: "01000000001",
      role: "OWNER",
      ownerProfile: {
        create: { fullName: "أحمد المالكي", verificationStatus: "VERIFIED" },
      },
    },
    include: { ownerProfile: true },
  });

  // ---------- Demo student ----------
  const studentUser = await prisma.user.create({
    data: {
      email: "student-demo@tolaby.test",
      passwordHash: await bcrypt.hash("Password123!", 10),
      phone: "01000000002",
      role: "STUDENT",
      studentProfile: {
        create: {
          fullName: "مريم الطالبة",
          university: "جامعة العاصمة للمعلوماتية (EUI)",
          faculty: "علوم الحاسب",
          academicYear: 2,
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  // ---------- Demo admin ----------
  await prisma.user.create({
    data: {
      email: "admin@tolaby.test",
      passwordHash: await bcrypt.hash("Password123!", 10),
      phone: "01000000003",
      role: "ADMIN",
    },
  });

  // ---------- Demo properties near the New Capital / EUI ----------
  const demoProperties = [
    {
      title: "غرفة مفروشة قريبة من EUI — حي R7",
      description: "غرفة مفروشة بالكامل في شقة مشتركة، تكييف، إنترنت عالي السرعة، على بعد 10 دقائق من الجامعة.",
      propertyType: "ROOM" as const,
      city: "العاصمة الإدارية",
      area: "R7",
      address: "شارع التسعين، الحي السكني السابع",
      latitude: 30.02,
      longitude: 31.735,
      monthlyRent: 4500,
      deposit: 2000,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      furnished: true,
      wifi: true,
      airConditioning: true,
      washingMachine: true,
      kitchen: true,
    },
    {
      title: "شقة كاملة لطالبتين — MU19",
      description: "شقة غرفتين وصالة، جديدة بالكامل، قريبة من مدينة الجامعات مباشرة.",
      propertyType: "APARTMENT" as const,
      city: "العاصمة الإدارية",
      area: "MU19",
      address: "مدينة الجامعات، بجوار EUI",
      latitude: 30.014,
      longitude: 31.728,
      monthlyRent: 9000,
      deposit: 4000,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      furnished: true,
      wifi: true,
      airConditioning: true,
      elevator: true,
      washingMachine: true,
      kitchen: true,
      privateBathroom: true,
    },
  ];

  for (const p of demoProperties) {
    const property = await prisma.property.create({
      data: { ...p, ownerId: ownerUser.ownerProfile!.id, status: "VERIFIED" },
    });

    // naive haversine distance for demo seeding
    for (const uni of universities) {
      const distanceKm = haversineKm(p.latitude, p.longitude, uni.latitude, uni.longitude);
      await prisma.propertyUniversityDistance.create({
        data: {
          propertyId: property.id,
          universityId: uni.id,
          distanceKm: Math.round(distanceKm * 10) / 10,
          etaMinutes: Math.round((distanceKm / 25) * 60), // rough estimate at 25km/h city driving
        },
      });
    }
  }

  console.log("✅ Seed complete:", {
    universities: universities.length,
    owner: ownerUser.email,
    student: studentUser.email,
    admin: "admin@tolaby.test",
    demoPassword: "Password123!",
  });
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
