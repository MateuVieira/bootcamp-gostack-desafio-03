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

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation faild' });
    }

    const { id, delivery_id } = req.query;

    const deliverymanExist = await Deliveryman.findByPk(id);

    if (!deliverymanExist) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    const deliveryExist = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id: id,
      },
    });

    if (!deliveryExist) {
      return res.status(401).json({
        error: 'This delivery is not registered to this deliveryman.',
      });
    }

    if (deliveryExist.canceled_at || deliveryExist.end_date) {
      return res
        .status(401)
        .json({ error: 'Delivery has already been completed.' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const end_date = new Date();
    const signature_id = file.id;

    await Delivery.update(
      { end_date, signature_id },
      { where: { id: delivery_id } }
    );

    return res.json({
      message: 'Register was a success.',
      end_date,
    });
  }
}

export default new DeliveriesController();
