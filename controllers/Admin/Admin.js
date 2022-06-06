const Seller = require("../../models/schemas/SellerSchema");
const Orders = require("../../models/schemas/OrdersSchema");

exports.allSellers = async (req, res) => {
  try {
    const allSellers = await Seller.find();
    res.status(200).json({
      status: "success",
      data: allSellers,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.allOrders = async (req, res) => {
    try {
      const allOrders = await Orders.find();
      res.status(200).json({
        status: "success",
        data: allOrders,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
