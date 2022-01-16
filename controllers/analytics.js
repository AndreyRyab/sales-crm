const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req, res) {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort({ data: 1});
    
    const ordersMap = getOrdersMap(allOrders);

    const previousDayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

    const previousDayOrderQuantity = previousDayOrders.length;
    
    const totalOrdersNumber = allOrders.length;

    const daysNumber = Object.keys(ordersMap).length;

    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

    const ordersPercentage = (((previousDayOrderQuantity / ordersPerDay) - 1) * 100).toFixed(2);
    
    const totalRevenue = calculateTotalRevenue(allOrders);

    const dailyRevenue = totalRevenue / daysNumber;

    const previousDayRevenue = calculateTotalRevenue(previousDayOrders);

    const revenuePercentage = (((previousDayRevenue / dailyRevenue) - 1) * 100).toFixed(2);

    const compareRevenue = (previousDayRevenue - dailyRevenue).toFixed(2);

    const compareOrderQuantity = (previousDayOrderQuantity - ordersPerDay).toFixed(2);

    res.status(200).json({
      revenue: {
        percentage: Math.abs(+revenuePercentage),
        compare: Math.abs(+compareRevenue),
        prevDay: +previousDayRevenue,
        isHigher: +revenuePercentage > 0,
      },
      orders: {
        percentage: Math.abs(+ordersPercentage),
        compare: Math.abs(+compareOrderQuantity),
        prevDay: +previousDayOrderQuantity,
        isHigher: +ordersPercentage > 0,
      },
    })

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.analytics = async function (req, res) {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort({ data: 1 });
    const ordersMap = getOrdersMap(allOrders);
    const avarage = +(calculateTotalRevenue(allOrders) / Object.keys(ordersMap).length.toFixed(2));

    const chart = Object.keys(ordersMap).map(label => {
      const revenue = calculateTotalRevenue(ordersMap[label]);
      const orders = ordersMap[label].length;

      return {
        label,
        revenue,
        orders,
      }
    })

    res.status(200).json({
      avarage,
      chart,
    });

  } catch (error) {
    errorHandler(res, error);
  }
};

function getOrdersMap(orders = []) {
  const daysOrders = {};
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }

    daysOrders[date].push(order);
  })

  return daysOrders;
};

function calculateTotalRevenue(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity;
    }, 0);
    return total += orderPrice;
  }, 0);
};
