import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const {
      query: { id },
      method,
      body,
    } = req;
    
    const transaction = await models.events.findOne({
      where: {
        id: id,
      }
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: transaction });
  });