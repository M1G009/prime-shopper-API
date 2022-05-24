const Order = require('./../../models/schemas/OrdersSchema');

//Gets
exports.getOrders = async (req, res) => {
    try {
        const conditions = {
            seller: req.SellerAuth._id
        }

        if (req.body.status && req.body.status !== '') {
            conditions.status = req.body.status
        }

        const options = [
            {
                populate: {
                    path: 'product.product',
                }
            },
            {
                populate: {
                    path: 'seller',
                    select: 'name email phoneNumber'
                }
            },
            {
                populate: {
                    path: 'courier.id',
                }
            },
            // {
            //     limit: 12,
            // },
            // {
            //     skip: req.body.skip ? req.body.skip : 0
            // }
        ]

        if (req.body.sort && req.body.sort !== '') {
            Object.keys(req.body.sort).map(k => {
                if (req.body.sort[k] !== '') {
                    options.push(
                        {
                            sort: {
                                [k]: +req.body.sort[k]
                            }
                        }
                    )
                }
            })
        }

        const sellerByOrder = await Model._find(_Order, conditions, options)
        if (!sellerByOrder) throw new Error('No Orders')

        _.res(res, sellerByOrder, 200)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//Get
exports.getOrder = async (req, res) => {
    try {
        const conditions = {
            _id: req.body.order,
            seller: req.SellerAuth._id
        }
        const options = [
            {
                populate: {
                    path: 'products',
                    select: 'title images banner'
                }
            },
            {
                populate: {
                    path: 'seller',
                    select: 'name email phoneNumber'
                }
            }
        ]

        const order = await Model._findOne(_Order, conditions, options)
        if (!order) throw new Error('No Orders')

        _.res(res, order, 200)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

//Update Order
exports.updateOrder = async (req, res) => {
    try {
        // console.log(req.body.orderId, req.body.couriorId, req.body.trackingId);
        if(!req.body.orderId || !req.body.couriorId || !req.body.trackingId){
            throw Error('Please enter valid values')
        }

        const order = await Order.findByIdAndUpdate(req.body.orderId, {courier: {id: req.body.couriorId, trackingId: req.body.trackingId}, status: 'Sent'})

        const options = [
            {
                populate: {
                    path: 'product.product',
                }
            },
            {
                populate: {
                    path: 'seller',
                    select: 'name email phoneNumber'
                }
            },
            {
                populate: {
                    path: 'courier.id',
                }
            },
            // {
            //     limit: 12,
            // },
            // {
            //     skip: req.body.skip ? req.body.skip : 0
            // }
        ]

        const orders = await Order.find().populate(options)

        res.status(200).json({
            status: 'success',
            data: orders
        });

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}