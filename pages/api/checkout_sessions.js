import models from '../../db/models/index';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const transaction = await models.transactions.findOne({
        order: [ [ 'createdAt', 'DESC' ]],
      });

    console.log(req.body);

  if (req.method === 'POST') {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                  price: '',
                  quantity: 1,
                }
             ],
            success_url: `http://localhost:3000/transaction/${transaction.id}`,
            cancel_url: `http://localhost:3000` ,
      });
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
  }
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}