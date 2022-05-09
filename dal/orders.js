const {
    Order,
    OrderStatus,
} = require('../models')

const getAllOrders = async () => {
    return await Order.collection().fetch({
        require: false,
        withRelated: ['orderStatus', "camera", "user"]
    })
}

const getAllStatus = async () => {
    const allStatus = await OrderStatus.fetchAll().map(os => {
        return [os.get('id'), os.get('name')]
    })
    return allStatus;
}

const getOrderById = async (orderId) => {
    return await Order.where({
        id: orderId
    }).fetch({
        require: true,
        withRelated: ['orderStatus']
    })
}

module.exports = {
    getAllOrders,
    getAllStatus,
    getOrderById
}