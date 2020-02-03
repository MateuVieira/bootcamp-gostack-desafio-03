import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery, repicient, deliveryman } = data;

    console.log('Send email!');

    if (delivery.start_date) {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Delivery cancelado.',
        template: 'cancellationAfterStart',
        context: {
          deliveryman: deliveryman.name,
          user: repicient.name,
          date: format(
            parseISO(delivery.canceled_at),
            "'dia' dd 'de' MMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
          delivery_id: delivery.id,
        },
      });
    } else {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Delivery cancelado.',
        template: 'cancellation',
        context: {
          deliveryman: deliveryman.name,
          user: repicient.name,
          date: format(
            parseISO(delivery.canceled_at),
            "'dia' dd 'de' MMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
          delivery_id: delivery.id,
        },
      });
    }
  }
}

export default new CancellationMail();
