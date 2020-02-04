import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblems from '../models/DeliveryProblems';
import Repicient from '../models/Repicient';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class CancellationDeliveyController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .required()
        .min(1)
        .positive(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const deliveryProblem = await DeliveryProblems.findByPk(req.params.id);

    if (!deliveryProblem) {
      return res.status(401).json({ error: 'Delivery problem not found.' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    if (delivery.canceled_at || delivery.end_date) {
      return res.status(401).json({ error: 'Delivery already finish.' });
    }

    const canceled_at = new Date();

    await delivery.update({ canceled_at });

    const repicient = await Repicient.findByPk(delivery.repicient_id);
    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);

    await Queue.add(CancellationMail.key, {
      repicient,
      deliveryman,
      delivery,
    });

    return res.json(delivery);
  }
}

export default new CancellationDeliveyController();
