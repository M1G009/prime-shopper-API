const CartModal = require('../../models/schemas/CartSchema')

exports.getProducts = async (req, res) => {
  try {
    var condition = {};

    const options = [
      {
        populate: {
          path: "category",
        },
      },
      {
        populate: {
          path: "isFavorite",
          select: "product",
          populate: {
            path: "product",
            select: "title banner images",
          },
        },
      },
      {
        populate: {
          path: "seller",
        },
      },
      { limit: 12 },
      { skip: req.body.skip ? req.body.skip : 0 },
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
    var search = new RegExp(req.body.search, "gi");
    if (req.body.search) {
      condition[
        "$where"
      ] = `function() { return this.title.match(${search}) != null || this.price.toString().match(${search}) != null || this.sellingPrice.toString().match(${search}) != null || this.discount.toString().match(${search}) != null || this.quantity.toString().match(${search}) != null || this.description.match(${search}) != null || this.features.match(${search}) != null || this.status.match(${search}) != null || 
            this.createdAt.toString().match(${search}) != null;}`;
    }

    const products = await Model._find(_Products, condition, options, false);
    if (!products) throw new Error("Product not found");

    _.res(res, products, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.getProduct = async (req, res) => {
  try {
    var condition = {
      _id: req.body.product,
    };
    const options = [
      {
        populate: {
          path: "category",
        },
      },
      {
        populate: {
          path: "isFavorite",
          select: "title banner images",
        },
      },
      {
        populate: {
          path: "seller",
        },
      },
    ];
    const product = await Model._findOne(_Products, condition, options, false);
    if (!product) throw new Error("No Product found");

    _.res(res, product, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//Cart
exports.addToCart = async (req, res) => {
  try {
    const conditions = {
      product: req.body.product,
      user: req.Auth._id,
      variations: req.body.variations,
    };
    let increment = req.body.increment;
    const carts = await Model._findOne(_Cart, conditions, {}, false);

    if (!carts) {
      // ADD INTO CART
      delete req.body.increment;
      req.body = _._form(req.body);
      var required = ["product", "variations"];
      var validate = _._checkFields(req.body, required);
      if (validate !== true) throw new Error(validate.message);

      req.body.user = req.Auth._id;
      req.body.quantity = 1;

      const addToCart = await Model._create(_Cart, req.body);
      if (!addToCart) throw new Error("Invalid Arguments");
      _.res(res, addToCart, 200);

      return false;
    }
    // UPDATE CART

    if (increment) {
      delete req.body.product;
      delete req.body.variations;
      delete req.body.increment;
      const cart = await Model._findOne(_Cart, conditions, {}, false);
      let quantity = cart['quantity'] + 1;
      var updatedCart = await CartModal.findByIdAndUpdate(cart._id, {quantity})
      _.res(res, updatedCart, 200);

    } else {

      delete req.body.product;
      delete req.body.variations;
      delete req.body.increment;
      const updateFields = Object.keys(req.body);
      const allowFields = ["quantity"];
      const validations = updateFields.every((update) =>
        allowFields.includes(update)
      );
      if (!validations) throw new Error("Invalid Arguments");

      const cart = await Model._findOne(_Cart, conditions, {}, false);

      Object.keys(req.body).map((k) => {
        cart[k] = req.body[k];
      });

      var updatedCart = await cart.save();

      if (updatedCart.quantity == 0) {
        cart.remove();
        _.res(res, "Cart is empty", 200);
        return;
      }

      _.res(res, updatedCart, 200);
    }
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.cart = async (req, res) => {
  try {
    const conditions = {
      user: req.Auth._id,
      quantity: {
        $ne: 0,
      },
    };
    const cartIds = await Model._find(_Cart, conditions, []);
    if (!cartIds) throw new Error("Cart Is Empty");
    const options = [
      {
        populate: {
          path: "product",
          select: "title seller variations",
          populate: [
            {
              path: "seller",
              select: "name phoneNumber",
            },
          ],
        },
      },
      {
        populate: {
          path: "user",
          select: "name phoneNumber",
        },
      },
    ];
    const cart = await Model._find(_Cart, conditions, options);
    if (!cart) throw new Error("Cart Is Empty");

    _.res(res, {cart, cartIds}, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const conditions = {
      _id: req.body.productId,
      user: req.Auth._id,
    };
    var updatedCart = await CartModal.findByIdAndDelete(conditions._id)
    _.res(res, updatedCart, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.allProductsRemoveFromCart = async (req, res) => {
  try {
    const condition = {
      user: req.Auth._id,
    };

    const carts = await Model._find(_Cart, condition, {});
    if (carts == "") throw new Error("Cart is already Empty");

    var cart = [];
    carts.map((c) => {
      cart.push(c._id);
    });

    await _Cart.deleteMany({ _id: { $in: cart } });

    _.res(res, "Successfully Empty cart", 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//Favorites
exports.addToFavorite = async (req, res) => {
  try {
    const condition = {
      user: req.Auth._id,
      product: req.body.product,
    };

    const favorite = await Model._findOne(_Favorites, condition, {}, false);

    if (!favorite) {
      req.body = _._form(req.body);
      req.body.user = req.Auth._id;

      const addToFavorite = await Model._create(_Favorites, req.body);
      if (!addToFavorite) throw new Error("Invalid Arguments");

      _.res(res, "Added as favorites", 200);

      return false;
    } else {
      const favorite = await Model._findOne(_Favorites, condition, {}, false);
      if (!favorite)
        throw new Error(
          "Oops ! Something went wrong,Maybe seller Removed already."
        );

      favorite.remove();
      _.res(res, "Removed from favorites", 200);
    }
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.Favorites = async (req, res) => {
  try {
    const condition = {
      user: req.Auth._id,
    };
    if (req.body.type == "seller") {
      condition.seller = {
        $ne: null,
      };
    }
    if (req.body.type == "product") {
      condition.product = {
        $ne: null,
      };
    }

    const options = [
      {
        populate: {
          path: "seller",
        },
      },
      {
        populate: {
          path: "user",
          select: "name phoneNumber",
        },
      },
      {
        populate: {
          path: "product",
        },
      },
    ];

    const favorites = await Model._find(_Favorites, condition, options);
    if (!favorites) throw new Error("Favorites Is Empty");

    _.res(res, favorites, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//Product via category
exports.getProductByCategory = async (req, res) => {
  try {
    const condition = {
      category: req.body.category,
    };
    const options = [
      {
        populate: {
          path: "seller",
          select: "name phoneNumber",
        },
      },
      {
        populate: {
          path: "category",
          select: "name",
        },
      },
      {
        skip: req.body.skip ? +req.body.skip : 0,
      },
      {
        limit: 15,
      },
    ];
    const productByCategory = await Model._find(_Products, condition, options);
    if (!productByCategory) throw new Error("No Product found");

    _.res(res, productByCategory, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.productFormsFiled = async (req, res) => {
  try {
    const conditions = {
      category: req.body.category,
    };

    const options = {
      populate: {
        path: "category",
        select: "name type",
      },
    };

    const productFormsFiled = await Model._findOne(
      _ProductForms,
      conditions,
      options,
      false
    );

    _.res(res, productFormsFiled, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};
