import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Repicient from '../models/Repicient';
import File from '../models/File';

class DeliveriesController {
  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .min(1)
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const deliverymanExist = await Deliveryman.findByPk(req.params.id);

    if (!deliverymanExist) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    const delivery = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product', 'end_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Repicient,
          as: 'repicient',
          attributes: ['id', 'name'],
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
}

export default new DeliveriesController();
