const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "AllCategories",
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "AllCategories",
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Sellers",
    default: null,
    required: [true, "Seller is require"],
  },
  title: {
    type: String,
    required: [true, "Title is require"],
  },
  sku: {
    type: String,
    required: [true, "SKU is require"],
    unique: [true, "SKU must be unique"],
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["In stock", "Out of stock"],
    default: "In stock",
  },
  productStatus: {
    type: String,
    enum: ["Active", "Inactive", "Draft"],
    default: "Active",
  },
  slug: {
    type: String,
    unique: [true, "slug must be unique"],
  },
  productOtherDetails: [],
  feed_product_type: {
    type: String,
  },
  brand_name: {
    type: String,
  },
  external_product_id: {
    type: String,
  },
  external_product_id_type: {
    type: String,
    enum: ["GTIN", "EAN", "PZN", "GCID", "ISBN", "UPC"],
    default: "GTIN",
  },
  part_number: {
    type: String,
  },
  bullet_point: {
    type: [String],
  },
  max_shelf_life: {
    type: String,
  },
  material_type_free: {
    type: [String],
  },
  material_composition: {
    type: String,
  },
  is_waterproof: {
    type: Boolean,
  },
  manufacturer: {
    type: String,
  },
  packer_details: {
    type: String,
  },
  importer_details: {
    type: String,
  },
  number_of_boxes: {
    type: String,
  },
  country_of_origin: {
    type: String,
  },
  product_information: {
    type: String,
  },
  fulfillment_latency: {
    type: String,
  },
  max_order_quantity: {
    type: String,
  },
  safety_information: {
    type: String,
  },
  indications: {
    type: String,
  },
  directions: {
    type: String,
  },
  legal_disclaimer: {
    type: String,
  },
  variations: {
    variations1: {
      var_type: {
        type: String,
        enum: ["Variation", "Accessory",''],
      },
      var_theme_type: String,
      data: [String],
    },
    variations2: {
      var_type: {
        type: String,
        enum: ["Variation", "Accessory", ''],
      },
      var_theme_type: String,
      data: [String],
    },
    children: [
      {
        banner: {
          type: String,
          default: "",
          required: [true, "Please add product banner"]
        },
        parent_sku: String,
        variation1: {
          var_title: String,
          value: String,
        },
        variation2: {
          var_title: String,
          value: String,
        },
        quantity: {
          type: Number,
          default: 0,
          min: [0, "Quantity should be more than or equal to 0"],
        },
        images: [String],
        Product_video_url: String,
        dimensions: {
          item_length: String,
          item_width: String,
          item_height: String,
          item_weight: String,
        },
        price: {
          price_in_india: Number,
          price_in_unitedkingdom: Number,
          price_in_france: Number,
          price_in_germany: Number,
          price_in_netherland: Number,
          price_in_switzerland: Number,
          price_in_italy: Number,
          price_in_canada: Number,
          price_in_unitedstate: Number,
        },
        sellingPrice: {
          selling_price_in_india: Number,
          selling_price_in_unitedkingdom: Number,
          selling_price_in_france: Number,
          selling_price_in_germany: Number,
          selling_price_in_netherland: Number,
          selling_price_in_switzerland: Number,
          selling_price_in_italy: Number,
          selling_price_in_canada: Number,
          selling_price_in_unitedstate: Number,
        },
        discount: {
          discount_price_in_india: {
            type: Number,
          },
          discount_price_in_unitedkingdom: {
            type: Number,
          },
          discount_price_in_france: {
            type: Number,
          },
          discount_price_in_germany: {
            type: Number,
          },
          discount_price_in_netherland: {
            type: Number,
          },
          discount_price_in_switzerland: {
            type: Number,
          },
          discount_price_in_italy: {
            type: Number,
          },
          discount_price_in_canada: {
            type: Number,
          },
          discount_price_in_unitedstate: {
            type: Number,
          },
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

ProductsSchema.virtual("isFavorite", {
  ref: "Favorites", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "product", // is equal to `foreignField`
  justOne: true,
});

ProductsSchema.set("toObject", { virtuals: true });
ProductsSchema.set("toJSON", { virtuals: true });

const ProductsModel = mongoose.model("Products", ProductsSchema);

module.exports = ProductsModel;