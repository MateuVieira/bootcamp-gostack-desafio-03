import * as Yup from 'yup';

import DeliveryProblems from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .min(1)
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    const deliveryProblems = await DeliveryProblems.findAll({
      where: {
        delivery_id: req.params.id,
      },
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schemaParams = Yup.object().shape({
      id: Yup.number()
        .required()
        .min(1)
        .positive(),
    });

    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const schemaBody = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    const deliveryProblems = await DeliveryProblems.create({
      description: req.body.description,
      delivery_id: req.params.id,
    });

    return res.json(deliveryProblems);
  }
}

export default new DeliveryProblemsController();
