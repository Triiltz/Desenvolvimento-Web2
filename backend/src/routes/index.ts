import { Router } from 'express';

import stationsRouter from './stations';

const routes = Router();

routes.use('/stations', stationsRouter);

export default routes;
