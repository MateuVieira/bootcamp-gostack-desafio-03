import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class NewDeliverieMail {
  get key() {
    return 'NewDeliverieMail';
  }

  async handle({ data }) {
    const { deliverie, repicient, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Deliverie.',
      template: 'newDeliverie',
      context: {
        deliveryman: deliveryman.name,
        user: repicient.name,
        date: format(new Date(), "'dia' dd 'de' MMM', às' H:mm'h'", {
          locale: pt,
        }),
        deliverie_id: deliverie.id,
      },
    });
  }
}

export default new NewDeliverieMail();
