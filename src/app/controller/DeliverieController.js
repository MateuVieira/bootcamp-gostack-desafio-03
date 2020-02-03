import * as Yup from 'yup';

import Repicient from '../models/Repicient';
import Deliveryman from '../models/Deliveryman';
import Deliverie from '../models/Deliverie';

class DeliverieController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      repicient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const repicientExist = await Repicient.findByPk(req.body.repicient_id);

    if (!repicientExist) {
      return res.status(401).json({ error: 'Repicient does not exist.' });
    }

    const deliverymanExist = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExist) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    const deliverie = await Deliverie.create(req.body);

    return res.json(deliverie);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number(),
      product: Yup.string(),
      repicient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const { id, deliveryman_id, repicient_id, canceled_at } = req.body;

    const deliverie = await Deliverie.findByPk(id);

    if (!deliverie) {
      return res.status(401).json({ error: 'Deliverir does not exist.' });
    }

    if (canceled_at) {
      return res
        .status(401)
        .json({ error: `Deliverie canceled at - ${canceled_at}.` });
    }

    if (repicient_id) {
      const repicientExist = await Repicient.findByPk(req.body.repicient_id);

      if (!repicientExist) {
        return res.status(401).json({ error: 'Repicient does not exist.' });
      }
    }

    if (deliveryman_id) {
      const deliverymanExist = await Deliveryman.findByPk(
        req.body.deliveryman_id
      );

      if (!deliverymanExist) {
        return res.status(401).json({ error: 'Deliveryman does not exist.' });
      }
    }

    const { product } = await deliverie.update(req.body);

    return res.json({
      product,
      repicient_id,
      deliveryman_id,
    });
  }
}

export default new DeliverieController();
