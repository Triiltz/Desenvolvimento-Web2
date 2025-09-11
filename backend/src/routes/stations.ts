import { Router } from 'express';

import { getAll } from '../controllers/station/getAll';

const stationsRouter = Router();

stationsRouter.get('/all', getAll);

export default stationsRouter;
