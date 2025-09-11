import { Request, Response } from 'express';

import { prisma } from '../../services/prisma';

export async function getAll(request: Request, response: Response) {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const offset = (page - 1) * limit;

    const stations = await prisma.station.findMany({
      skip: offset,
      take: limit,
    });

    return response.json(stations);
  } catch (error) {
    return response.status(500).json(error);
  }
}
