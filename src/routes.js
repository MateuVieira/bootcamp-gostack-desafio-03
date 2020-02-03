import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import RepicientsController from './app/controller/RepicientsController';
import DeliverymanController from './app/controller/DeliverymanController';
import DeliverieController from './app/controller/DeliverieController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.get('/repicients', RepicientsController.index);
routes.get('/repicients/:id', RepicientsController.show);
routes.post('/repicients', RepicientsController.store);
routes.put('/repicients', RepicientsController.update);
routes.delete('/repicients/:id', RepicientsController.delete);

routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/deliveries', DeliverieController.store);
routes.put('/deliveries', DeliverieController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
