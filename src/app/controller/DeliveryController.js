import * as Yup from 'yup';

import Queue from '../../lib/Queue';

import Repicient from '../models/Repicient';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import NewDeliverieMail from '../jobs/NewDeliverieMail';

class DeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findAll({
      include: [
        {
          model: Repicient,
          as: 'repicient',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(delivery);
  }

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

    const delivery = await Delivery.create(req.body);

    await Queue.add(NewDeliverieMail.key, {
      repicient: repicientExist,
      deliveryman: deliverymanExist,
      delivery,
    });

    return res.json(delivery);
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

    const { id, deliveryman_id, repicient_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(401).json({ error: 'Deliverir does not exist.' });
    }

    if (delivery.canceled_at) {
      return res
        .status(401)
        .json({ error: `Delivery canceled at - ${delivery.canceled_at}.` });
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

    const { product, canceled_at } = await delivery.update(req.body);

    if (canceled_at) {
      const repicient = await Repicient.findByPk(req.body.repicient_id);
      const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

      await Queue.add(CancellationMail.key, {
        repicient,
        deliveryman,
        delivery,
      });
    }
    return res.json({
      product,
      repicient_id,
      deliveryman_id,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .min(1)
        .positive(),
    });

    if (!(await schema.isValid(req.params.id))) {
      return res.status(400).json({ error: 'Validation faild' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery does not exist.' });
    }

    if (delivery.start_date) {
      return res.status(401).json({
        error: `Cannot delete delivery because delivery has already been withdrawn.`,
      });
    }

    await delivery.destroy();

    return res.json();
  }
}

export default new DeliveryController();
