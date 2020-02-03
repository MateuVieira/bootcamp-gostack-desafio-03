import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliverie, repicient, deliveryman } = data;

    console.log('Send email!');

    if (deliverie.start_date) {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Deliverie cancelado.',
        template: 'cancellationAfterStart',
        context: {
          deliveryman: deliveryman.name,
          user: repicient.name,
          date: format(
            parseISO(deliverie.canceled_at),
            "'dia' dd 'de' MMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
          deliverie_id: deliverie.id,
        },
      });
    } else {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Deliverie cancelado.',
        template: 'cancellation',
        context: {
          deliveryman: deliveryman.name,
          user: repicient.name,
          date: format(
            parseISO(deliverie.canceled_at),
            "'dia' dd 'de' MMM', às' H:mm'h'",
            {
              locale: pt,
            }
          ),
          deliverie_id: deliverie.id,
        },
      });
    }
  }
}

export default new CancellationMail();
