import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
  // Get method
  .get(async (req, res) => {
    const {
      query: { slug },
      method,
      body,
    } = req;
    const event = await models.events.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: models.users,
          as: 'user',
        },
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: event });
  })
  //Post method
  .post(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, desc, start, end} = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newevent = {};
      
    try {
      newevent = await models.events.create({
        title,
        desc,
        start,
        end,
        status: 1,
        userId: user.id,
      });
    } catch (err) {
      /* Sql error number */
      statusCode = 500;
      error = err.original.errno && 'Not available right now';
      status = 'error';
    }

    return res.status(statusCode).json({
      status,
      error,
      message: 'done',
      data: newevent,
    });
  })
   //Put method
 .put(async (req, res) => {
  const { query } = req;
  const { slug } = req.query;
  const { body } = req;
  const { title, desc, start, end} = body;

  const editEvent = await models.events.update({
    title: title,
    desc: desc,
    start: start,
    end: end,
  },{where: {
    slug: slug,
  }});

  return res.status(200).json({
    status: 'success',
    message: 'done',
    data: editEvent,
  });
})
  //Delete method
  .delete(async (req,res) => {
    const {
      query: { slug },
      method,
      body,
    } = req
    const deleteEvent = await models.events.destroy({
      where: {
        slug: slug,
      },
    })
    res.statusCode = 200;
    return res.json({ status: 'success', data: deleteEvent });
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  })
      
  export default handler;