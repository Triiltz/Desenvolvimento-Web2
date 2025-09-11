import { Request, Response } from 'express';

import { prisma } from '../../services/prisma';

export async function getAll(request: Request, response: Response) {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Math.min(Number(request.query.limit) || 50, 100);
    const offset = (page - 1) * limit;

    const { minLat, maxLat, minLng, maxLng, search, userLat, userLng } =
      request.query as Record<string, string>;

    // Monta filtro de bounding box caso coordenadas sejam enviadas
    const where: any = {};
    if (minLat && maxLat && minLng && maxLng) {
      where.AND = [
        { lat: { gte: parseFloat(minLat) } },
        { lat: { lte: parseFloat(maxLat) } },
        { lng: { gte: parseFloat(minLng) } },
        { lng: { lte: parseFloat(maxLng) } },
      ];
    }

    if (search) {
      const term = search.toLowerCase();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { address: { contains: term, mode: 'insensitive' } },
      ];
    }

    const stations = await prisma.station.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
    });

    let mapped = stations.map((s) => ({ ...s }));

    // Calcula distância se usuário forneceu lat/lng
    if (userLat && userLng) {
      const uLat = parseFloat(userLat);
      const uLng = parseFloat(userLng);
      mapped = mapped
        .map((s) => {
          const distanceKm = haversine(uLat, uLng, s.lat, s.lng);
          return {
            ...s,
            distanceMeters: Math.round(distanceKm * 1000),
          };
        })
        .sort((a, b) => a.distanceMeters - b.distanceMeters);
    }

    return response.json({
      page,
      limit,
      count: mapped.length,
      data: mapped,
    });
  } catch (error) {
    return response.status(500).json(error);
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
