const Orders = require("../../models/schemas/OrdersSchema");
const Razorpay = require("razorpay");

var Publishable_Key =
  "pk_test_51KsmT8SEjT7ghSr23sO4arBOd5JiwkYNqVAlgv7OUPFytKOJpkibtGA7eJIztROxZbK0sTX9dE5GClLcNmarD7L1000T1byaYy";
var Secret_Key =
  "sk_test_51KsmT8SEjT7ghSr2tMC70E3buJhzjmYB1TrbXfRiRZTtibCMes84z7bq9HPAnzwmavxre8mEkHuBPmj9cG9GS2yH00nLDWitM4";

const stripe = require("stripe")(Secret_Key);

var instance = new Razorpay({
  key_id: "rzp_test_weS4smSu2KR8w3",
  key_secret: "8ljLEubQyoC651DvgHRy8FDb",
});

exports.createPayment = async (req, res) => {
  try {
    let paymentData = req.body.paymentData;
    let userData = req.body.checkoutdata;

    if (!paymentData) throw new Error("Stripe token required");
    if (
      !userData ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.contact_number ||
      !userData.billingAddress
    )
      throw new Error("user details are not valid");

    if (!userData.totalPrice) throw new Error("Total price required");

    let billingData = userData.billingAddress;
    let cartData = userData.cartData;
    let sellers = [];

    cartData.map((el) => {
      let seller = el.product.seller._id;
      if (!sellers.includes(seller)) {
        sellers.push(seller);
      }
    });

    // return res.status(200).json({
    //   cartData
    // })

    var options = {
      amount: paymentData.total,
      currency: "INR",
      receipt: paymentData.token,
    };

    instance.orders.create(options, async function (err, order) {
      if (err) {
        res.status(404).json({
          status: "fail",
          message: err
        })
      }
      try {
        let billingAddressData = {
          address_line1: billingData.address_line1
            ? billingData.address_line1
            : "",
          address_line2: billingData.address_line2
            ? billingData.address_line2
            : "",
          address_zip: billingData.address_zip ? billingData.address_zip : "",
          address_city: billingData.address_city
            ? billingData.address_city
            : "",
          address_state: billingData.address_state
            ? billingData.address_state
            : "",
          address_country: billingData.address_country
            ? billingData.address_country
            : "",
        };

        let paymentEntrydata = {
          user: req.Auth._id,
          seller: sellers,
          paymentID: order.id,
          paymentStatus: "Paid",
          paymentType: "Razorpay",
          paymentToken: paymentData.token,
          paymentReceipt: order.receipt,
          billingAddress: billingAddressData,
          invoiceNumber: order.receipt,
          amount: paymentData.total,
          sellingAmount: paymentData.sellingTotal,
        };

        const payment = await Model._create(_Payment, paymentEntrydata);
        if (!payment) throw new Error("No Payment found");

        let ordersData = [];
        cartData.map((el) => {
          let seller = el.product.seller._id;

          let product = {
            product: el.product.id,
            quantity: el.quantity,
            price: el.product.variations.sellingPrice.selling_price_in_india,
          };

          let orderData = {
            user: req.Auth._id,
            product: product,
            seller: seller,
            orderNumber: order.id,
            note: "",
            sellingAmount:
              el.quantity *
              el.product.variations.sellingPrice.selling_price_in_india,
            total: el.quantity * el.product.variations.price.price_in_india,
            status: "Pending",
            payment_id: payment._id,
            shippingAddress: billingAddressData,
          };

          ordersData.push(orderData);
        });


        const orderObj = await Orders.create(ordersData);
        _.res(res, { payment, orderObj }, 200);
      } catch (err) {
        res.status(404).json({
          status: "fail",
          message: err.message
        })
      }
    });

    // stripe.customers
    //   .create({
    //     email: req.body.stripeData.email,
    //     source: req.body.stripeData.id,
    //     name: userData.first_name+" "+userData.last_name,
    //     address: {
    // line1: billingData.address_line1 ? billingData.address_line1 : "",
    // line2: billingData.address_line2 ? billingData.address_line2 : "",
    // postal_code: billingData.address_zip ? billingData.address_zip : "",
    // city: billingData.address_city ? billingData.address_city : "",
    // state: billingData.address_state ? billingData.address_state : "",
    // country: billingData.address_country ? billingData.address_country : "",
    //     },
    //   })
    //   .then((customer) => {
    //     // console.log(customer);
    //     return stripe.charges.create({
    //       amount: userData.totalPrice, // Charing Rs 25
    //       description: " ",
    //       currency: "INR",
    //       customer: customer.id,
    //     });
    //   })
    //   .then((charge) => {
    //     console.log(charge);
    //     res.send(charge); // If no error occurs
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.send(err); // If some error occurs
    //   });

    // req.body = _._form(req.body);
    // var required = ["seller", "paymentType", "invoiceNumber", "amount", "email", "token"]

    // var validate = _._checkFields(req.body, required)
    // if (validate !== true) throw new Error(validate.message)

    // req.body.user = req.Auth._id
    // const payment = await Model._create(_Payment, req.body)
    // if (!payment) throw new Error('Invalid payment')

    // _.res(res, payment, 200)
    // _.res(res, {session}, 200);

    // var options = {
    //   amount: 50000,
    //   currency: "INR",
    //   receipt: "pay_JQJX2SGGFrQrGo",
    // };
    // instance.orders.create(options, function (err, order) {
    //   if(err){
    //     res.send(err)
    //   }
    //   console.log(order);
    // res.send(order)
    // });

    // res.json({ data: req.body });
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

exports.getPayment = async (req, res) => {
  try {
    if (!req.body.payment) throw new Error("Payment is required");
    const conditions = {
      _id: req.body.payment,
      user: req.Auth._id,
    };

    const options = {
      populate: {
        path: "order",
        select: "products subtotal discount total",
      },
    };
    const payment = await Model._findOne(_Payment, conditions, options, false);
    if (!payment) throw new Error("No Payment found");

    _.res(res, payment, 200);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

exports.getPayments = async (req, res) => {
  try {
    const conditions = {
      user: req.Auth._id,
    };

    const options = [
      {
        populate: {
          path: "order",
          select: "products subtotal discount total",
        },
      },
      {
        limit: 12,
      },
      {
        skip: req.body.skip ? req.body.skip : 0,
      },
    ];
    if (req.body.sort && req.body.sort !== "") {
      Object.keys(req.body.sort).map((k) => {
        if (req.body.sort[k] !== "") {
          options.push({
            sort: {
              [k]: +req.body.sort[k],
            },
          });
        }
      });
    }
    const payments = await Model._find(_Payment, conditions, options);
    if (!payments) throw new Error("No Payments");

    _.res(res, payments, 200);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};
