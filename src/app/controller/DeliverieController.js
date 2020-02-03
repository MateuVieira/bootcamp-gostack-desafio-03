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
}

export default new DeliverieController();
