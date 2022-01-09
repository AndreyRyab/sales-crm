const errorHandler = require('../utils/errorHandler');

const Order = require( '../models/Order' );

module.exports.getAll = async function (req, res) {
  const query = {
    user: req.user.id,
  };
  // Date of start: 
  if (req.query.start) {
    query.date = {
      // Greater or equal (special mongoose syntax)
      $gte: req.query.start,
    }
  }

  if (req.query.end) {
    if (!query.date) {
      query.date = {};
    }
    // less or equal
    query.date['$lte'] = req.query.end;
  }

  if (req.query.order) {
    query.order = +req.query.order;
  }
  
  try {
    const orders = await Order
      .find(query)
      .sort({ date: -1 })
      .skip(+req.query.offset)
      .limit(+req.query.limit);

    res.status(200).json(orders);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.create = async function (req, res) {
  try {
    const lastOrder = await Order.findOne({
      user: req.user.id,
    }).sort({ date: -1 });

    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      list: req.body.list,
      user: req.user.id,
      order: maxOrder++,
    }).save();
    res.status(201).json(order);
  } catch (error) {
    errorHandler(res, error);
  }
};
