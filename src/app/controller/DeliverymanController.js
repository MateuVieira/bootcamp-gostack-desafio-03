import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findAll();

    return res.json(deliveryman);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(4),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(401).json({ error: 'Deliveryman already exists.' });
    }

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().min(1),
      name: Yup.string().min(4),
      email: Yup.string().email(),
      avatar_id: Yup.number().min(1),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const { id, email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (email && email !== deliveryman.email) {
      const deliverymanExist = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExist) {
        return res.status(401).json({ error: 'Deliveryman already exists.' });
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    await deliveryman.destroy();

    return res.status(200).json();
  }
}

export default new DeliverymanController();
