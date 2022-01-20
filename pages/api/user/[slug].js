import nextConnect from 'next-connect';
import middleware from '../../../middleware/auth';
const models = require('../../../db/models/index');

const handler = nextConnect()
  // Middleware
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const userId = slug;
    const user = await models.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: models.posts,
          as: 'posts',
        },
        {
          model: models.jobs,
          as: 'jobs',
        },
      ],
    });
    res.statusCode = 200;
    return res.json({ status: 'success', data: user });
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {
    console.log(req.body)
    const { id } = req.user;
    const { balanceUpdate, card, status } = req.body;
    const user = await models.users.findOne({
      where: { id: id },
      attributes: ['balance'],
      limit: 1,
    })
    const dataUser = user.toJSON();
    const newBalance = dataUser.balance + balanceUpdate;
    console.log(newBalance);
    const editUser = await models.users.update({
      balance: newBalance,
    },{where: {id: id}});
    const newTransaction = await models.transactions.create({
      type: 'add',
      status: status,
      userId: id, 
    })
    return res.status(200).json({
      status: 'success',
      message: 'done',
      data: editUser,
    });
  })  
  .patch(async (req, res) => {});

export default handler;
