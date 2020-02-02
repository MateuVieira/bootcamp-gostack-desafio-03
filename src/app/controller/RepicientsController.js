import * as Yup from 'yup';

import Repicient from '../models/Repicient';

class RepicientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number()
        .required()
        .positive(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      complemento: Yup.string(),
      cep: Yup.string()
        .required()
        .length(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verification faild.' });
    }

    const repicient = await Repicient.create(req.body);

    return res.json(repicient);
  }
}

export default new RepicientsController();
