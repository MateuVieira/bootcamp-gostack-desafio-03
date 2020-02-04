import * as Yup from 'yup';
import { Op } from 'sequelize';
import { getHours } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class StartDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .min(1)
        .positive(),
      delivery_id: Yup.number()
        .required()
        .min(1)
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const deliverymanExist = await Deliveryman.findByPk(req.body.id);

    if (!deliverymanExist) {
      return res.status(401).json({ error: 'Deliveryman not found.' });
    }

    const deliveryExist = await Delivery.findByPk(req.body.delivery_id);

    if (!deliveryExist) {
      return res.status(401).json({ error: 'Delivery not found.' });
    }

    if (deliveryExist.canceled_at || deliveryExist.end_date) {
      return res.status(401).json({ erro: 'Delivery already finished.' });
    }

    if (deliveryExist.start_date) {
      return res.status(401).json({ error: 'Delivery already started.' });
    }

    const { row, count } = await Delivery.findAndCountAll({
      where: {
        start_date: {
          [Op.ne]: null,
        },
        canceled_at: {
          [Op.eq]: null,
        },
        end_date: {
          [Op.eq]: null,
        },
      },
    });

    if (count > 5) {
      return res.status(401).json({
        error:
          'It is not possible to start a new delivery. The limit has been reached.',
      });
    }

    const start_date = new Date();

    if (!(getHours(start_date) >= 8) && !(getHours(start_date) <= 19)) {
      return res.status(401).json({ error: 'Out of work hour.' });
    }

    const delivery = await deliveryExist.update({ start_date });

    return res.json(delivery);
  }
}

export default new StartDeliveryController();
