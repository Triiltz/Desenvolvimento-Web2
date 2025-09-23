import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

interface QueryParams {
  page?: number;
  limit?: number;
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  search?: string;
  userLat?: number;
  userLng?: number;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const params: QueryParams = {
    page: parseNumber(sp.get('page')) || 1,
    limit: Math.min(parseNumber(sp.get('limit')) || 50, 100),
    minLat: parseNumber(sp.get('minLat')),
    maxLat: parseNumber(sp.get('maxLat')),
    minLng: parseNumber(sp.get('minLng')),
    maxLng: parseNumber(sp.get('maxLng')),
    search: sp.get('search') || undefined,
    userLat: parseNumber(sp.get('userLat')),
    userLng: parseNumber(sp.get('userLng')),
  };

  const where: any = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { address: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (
    params.minLat != null &&
    params.maxLat != null &&
    params.minLng != null &&
    params.maxLng != null
  ) {
    where.AND = [
      { lat: { gte: params.minLat } },
      { lat: { lte: params.maxLat } },
      { lng: { gte: params.minLng } },
      { lng: { lte: params.maxLng } },
    ];
  }

  const skip = (params.page! - 1) * params.limit!;

  const [count, stations] = await Promise.all([
    prisma.station.count({ where }),
    prisma.station.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: { id: 'asc' },
      include: { features: true, fuels: true },
    }),
  ]);

  type RawStation = (typeof stations)[number];
  // RawStation inclui campos do modelo Prisma Station
  interface EnrichedStation extends RawStation {
    distanceMeters?: number;
    lat: number;
    lng: number;
  }

  let enriched: EnrichedStation[] = stations.map((s: any) => {
    const fuelsObj: Record<string, { price: number; updated: string }> = {};
    for (const f of s.fuels) {
      fuelsObj[f.type.toLowerCase()] = {
        price: f.price,
        updated: f.updated.toISOString(),
      };
    }
    return {
      ...s,
      features: s.features.map((f: any) => f.name),
      fuels: fuelsObj,
    };
  });

  if (params.userLat != null && params.userLng != null) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371e3; // metros
    enriched = enriched
      .map((s: EnrichedStation) => {
        const dLat = toRad(s.lat - params.userLat!);
        const dLng = toRad(s.lng - params.userLng!);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(params.userLat!)) *
            Math.cos(toRad(s.lat)) *
            Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = Math.round(R * c);
        return { ...s, distanceMeters };
      })
      .sort(
        (a: EnrichedStation, b: EnrichedStation) =>
          a.distanceMeters! - b.distanceMeters!
      );
  }

  return Response.json({
    page: params.page,
    limit: params.limit,
    count,
    data: enriched,
  });
}
