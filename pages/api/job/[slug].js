import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
   //delete method
   .delete(async (req,res) => {
    const {
      query: { slug },
      method,
      body,
    } = req
    const job = await models.jobs.destroy({
      where: {
        slug: slug,
      },
    })
    res.statusCode = 200;
    return res.json({ status: 'success', data: job });
  })
  
  // Get method
  .get(async (req, res) => {
    const {
      query: { slug },
      method,
      body,
    } = req;
    const job = await models.jobs.findOne({
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
    return res.json({ status: 'success', data: job });
  })
  // Post method
  .post(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, content, emailTo, reportManager, dateLimit } = body;
    const { slug } = req.query;
    const { user } = req;
    let status = 'success',
      statusCode = 200,
      error = '',
      newJob = {};

    try {
      newJob = await models.jobs.create({
        title,
        content,
        emailTo,
        reportManager,
        dateLimit,
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
      data: newJob,
    });
  })
  // Put method
  .put(async (req, res) => {
    const {
      query: { id, name },
      method,
      body,
    } = req;
    const { title, content,reportManager, dateLimit } = body;
    const { slug } = req.query;
    const { user } = req;

    const editJob = await models.jobs.update({
        title,
        content,
        reportManager,
        dateLimit,
        userId: user.id,
      },{where: {
        slug: slug,
      }});

    return res.status(statusCode).json({
      status: 'success',
      message: 'done',
      data: editJob,
    });
  })
  // Patch method
  .patch(async (req, res) => {
    throw new Error('Throws me around! Error can be caught and handled.');
  });

export default handler;
