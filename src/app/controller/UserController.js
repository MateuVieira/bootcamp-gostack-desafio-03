import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(4),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verify faild.' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(401).json({ error: 'User already exist.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(4),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (old_password, field) =>
          old_password ? field.required() : field
        ),
      confirm_password: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation faild.' });
    }

    const user = await User.findByPk(req.userId);

    const { email, old_password } = req.body;

    if (email && email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: 'User already exist' });
      }
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
