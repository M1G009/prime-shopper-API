const Schema = mongoose.Schema;
const childSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  slug: {
    type: String,
    default: "",
  },
  banner: {
    type: String,
    required: [true, "Please add product banner"],
  },
  Colour: {
    type: String,
    default: "",
  },
  parent_sku: {
    type: String,
    default: "",
  },
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
    required: [true, "quantity must be required"]
  },
  images: [String],
  Product_video_url: {
    type: String,
    default: "",
  },
  dimensions: {
    item_length: {
      type: String,
      default: "",
    },
    item_width: {
      type: String,
      default: "",
    },
    item_height: {
      type: String,
      default: "",
    },
    item_weight: {
      type: String,
      default: "",
    },
  },
  price: {
    price_in_india: Number | String,
    price_in_unitedkingdom: Number | String,
    price_in_france: Number | String,
    price_in_germany: Number | String,
    price_in_netherland: Number | String,
    price_in_switzerland: Number | String,
    price_in_italy: Number | String,
    price_in_canada: Number | String,
    price_in_unitedstate: Number | String,
  },
  sellingPrice: {
    selling_price_in_india: Number | String,
    selling_price_in_unitedkingdom: Number | String,
    selling_price_in_france: Number | String,
    selling_price_in_germany: Number | String,
    selling_price_in_netherland: Number | String,
    selling_price_in_switzerland: Number | String,
    selling_price_in_italy: Number | String,
    selling_price_in_canada: Number | String,
    selling_price_in_unitedstate: Number | String,
  },
  discount: {
    discount_price_in_india: Number | String,
    discount_price_in_unitedkingdom: Number | String,
    discount_price_in_france: Number | String,
    discount_price_in_germany: Number | String,
    discount_price_in_netherland: Number | String,
    discount_price_in_switzerland: Number | String,
    discount_price_in_italy: Number | String,
    discount_price_in_canada: Number | String,
    discount_price_in_unitedstate: Number | String,
  },
  sku: {
    type: String,
    required: [true, "SKU is require"],
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
  feed_product_type: {
    type: String,
    default: ""
  },
  external_product_id: {
    type: String,
    default: ""
  },
  external_product_id_type: {
    type: String,
    enum: ["GTIN", "EAN", "PZN", "GCID", "ISBN", "UPC"],
    default: "GTIN",
  },
  part_number: {
    type: String,
    default: ""
  },
  bullet_point: {
    type: [String],
  },
  max_shelf_life: {
    type: String,
    default: ""
  },
  material_type_free: {
    type: [String],
  },
  material_composition: {
    type: String,
    default: ""
  },
  is_waterproof: {
    type: Boolean,
    default: false
  },
  manufacturer: {
    type: String,
    default: ""
  },
  packer_details: {
    type: String,
    default: ""
  },
  importer_details: {
    type: String,
    default: ""
  },
  number_of_boxes: {
    type: String,
    default: ""
  },
  country_of_origin: {
    type: String,
    default: ""
  },
  product_information: {
    type: String,
    default: ""
  },
  fulfillment_latency: {
    type: String,
    default: ""
  },
  max_order_quantity: {
    type: String,
    default: ""
  },
  safety_information: {
    type: String,
    default: ""
  },
  indications: {
    type: String,
    default: ""
  },
  directions: {
    type: String,
    default: ""
  },
  legal_disclaimer: {
    type: String,
    default: ""
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
});

const ProductsSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "AllCategories",
    required: [true, "Category is require"],
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "AllCategories",
    required: [true, "Parrent category is require"],
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Sellers",
    default: null,
    required: [true, "Seller is require"],
  },
  brand_name: {
    type: String,
    default: ""
  },
  variations1: {
    var_type: {
      type: String,
      enum: ["Variation", "Accessory", ""],
    },
    var_theme_type: String,
    data: [String],
  },
  variations2: {
    var_type: {
      type: String,
      enum: ["Variation", "Accessory", ""],
    },
    var_theme_type: String,
    data: [String],
  },
  variations: [childSchema],
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
