import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import RepicientsController from './app/controller/RepicientsController';
import DeliverymanController from './app/controller/DeliverymanController';
import DeliveryController from './app/controller/DeliveryController';
import DeliveriesController from './app/controller/DeliveriesController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/deliverymans/:id/deliveries', DeliveriesController.show);

routes.get('/deliverymans/:id', DeliverymanController.show);

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
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries', DeliveryController.update);
routes.delete('/deliveries', DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
