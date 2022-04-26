let fs = require("fs");
let path = require("path");
const csv = require("fast-csv");
const Categories = require("../../models/schemas/DynamicCategoriesSchema");
const Product = require("../../models/schemas/ProductsSchema");
var slugify = require("slugify");
var xlsx = require("xlsx");

//ADD
exports.doAdd = async (req, res) => {
  try {
    req.body = _._form(req.body);
    var required = ["category", "title", "price", "sellingPrice"];
    var validate = _._checkFields(req.body, required);
    if (validate !== true) throw new Error(validate.message);

    res.status(200).json({
      message: "success",
    });

    // if (req.files && req.files.banner && req.files.banner.length !== 0) {
    //     req.body.banner = req.files.banner[0].filename;
    // }
    // if (req.files && req.files.images) {
    //     var productImages = []
    //     req.files.images.map(file => {
    //         productImages.push(file.filename)
    //     })
    // }

    // var discount = (req.body.price - req.body.sellingPrice) / req.body.price * 100;
    // if (discount <= 0) throw new Error('Selling price greater than price,Please enter valid price');

    // const data = {
    //     category: req.body.category,
    //     seller: req.SellerAuth._id,
    //     title: req.body.title,
    //     slug: _._convertToSlug(req.body.title),
    //     price: req.body.price,
    //     sellingPrice: req.body.sellingPrice,
    //     discount: discount.toFixed(2),
    //     SKU: req.body.SKU,
    //     quantity: req.body.quantity,
    //     description: req.body.description,
    //     features: req.body.features,
    //     images: productImages,
    //     banner: req.body.banner,
    //     status: req.body.status
    // }
    // if (req.body.productOtherDetails && req.body.productOtherDetails !== '') {
    //     data.productOtherDetails = JSON.parse(req.body.productOtherDetails)
    // }
    // const addProduct = await Model._create(_Products, data)
    // // const addProduct = ''
    // if (!addProduct) {
    //     throw new Error('Invalid Arguments')
    // }

    // _.res(res, addProduct, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//DOWNLOAD CSV
exports.downloadCSV = async (req, res) => {
  try {
    var data = [
      {
        title: "Title",
        sku: "SKU",
        banner: "Banner",
        quantity: "Quantity",
        price_in_india: "Price In India",
        selling_price_in_india: "Selling Price In India",
        price_in_unitedkingdom: "Price In United Kingdom",
        selling_price_in_unitedkingdom: "Selling Price In United Kingdom",
        price_in_france: "Price In France",
        selling_price_in_france: "Selling Price In France",
        price_in_germany: "Price In Germany",
        selling_price_in_germany: "Selling Price In Germany",
        price_in_netherland: "Price In Netherland",
        selling_price_in_netherland: "Selling Price In Netherland",
        price_in_switzerland: "Price In Switzerland",
        selling_price_in_switzerland: "Selling Price In Switzerland",
        price_in_italy: "Price In Italy",
        selling_price_in_italy: "Selling Price In Italy",
        price_in_canada: "Price In Canada",
        selling_price_in_canada: "Selling Price In Canada",
        price_in_unitedstate: "Price In United State",
        selling_price_in_unitedstate: "Selling Price In United State",
        description: "Description",
        features: "Features",
        image1: "Other Image Url 1",
        image2: "Other Image Url 2",
        image3: "Other Image Url 3",
        image4: "Other Image Url 4",
        image5: "Other Image Url 5",
        image6: "Other Image Url 6",
        image7: "Other Image Url 7",
        image8: "Other Image Url 8",
      },
    ];

    let csvPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "csv",
      "Add_Products.csv"
    );
    const ws = fs.createWriteStream(csvPath);

    csv
      .write(data, { headers: true })
      .on("finish", function () {
        console.log("Finish");
      })
      .pipe(ws);

    res.status(200).json({
      statusMessage: "success",
      body: {
        csvPath,
      },
    });
  } catch (err) {
    res.status(404).json({
      statusMessage: "fail",
      message: err.message,
    });
  }
};

//ADD With CSV
exports.doAddCSV = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("please upload file");
    }
    let csvPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "csv",
      req.file.filename
    );

    const ec = (r, c) => {
      return xlsx.utils.encode_cell({ r: r, c: c });
    };

    const delete_row = (ws, row_index) => {
      let range = xlsx.utils.decode_range(ws["!ref"]);
      for (var R = row_index; R < range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
          ws[ec(R, C)] = ws[ec(R + 1, C)];
        }
      }
      range.e.r--;
      ws["!ref"] = xlsx.utils.encode_range(range.s, range.e);
    };

    // testing the delete row functionality
    let filename = csvPath;
    let workbook = xlsx.readFile(filename);
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    delete_row(ws, 0);
    delete_row(ws, 0);
    var xlsxData = xlsx.utils.sheet_to_json(ws);
    // console.log(xlsxData);

    let newProducts = [];

    xlsxData.map((el) => {
      if (el.parent_child == "Parent") {
        let newObject = {};
        newObject["category"] = req.body.id;
        newObject["parentId"] = req.body.parentId;
        newObject["seller"] = req.SellerAuth._id;
        newObject["status"] = "In stock";
        newObject["productStatus"] = "Active";
        newObject["material_type_free"] = [];
        newObject["bullet_point"] = [];
        newObject["variations1"] = {
          var_type: "",
          var_theme_type: "",
          data: [],
        };
        newObject["variations2"] = {
          var_type: "",
          var_theme_type: "",
          data: [],
        };
        newObject["variations"] = [];
        let childrenObject = {};
        childrenObject["images"] = [];
        childrenObject["dimensions"] = {};
        childrenObject["price"] = {};
        childrenObject["sellingPrice"] = {};
        childrenObject["discount"] = {};

        if (el.feed_product_type) {
          newObject["feed_product_type"] = el.feed_product_type;
        }
        if (el.sku) {
          newObject["sku"] = el.sku;
        }
        if (el.brand_name) {
          newObject["brand_name"] = el.brand_name;
        }
        if (el.external_product_id) {
          newObject["external_product_id"] = el.external_product_id;
        }
        if (el.external_product_id_type) {
          newObject["external_product_id_type"] = el.external_product_id_type;
        }
        if (el.title) {
          newObject["title"] = el.title;
          newObject["slug"] = slugify(el.title, {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          });
        }
        if (el.part_number) {
          newObject["part_number"] = el.part_number;
        }
        if (el.description) {
          newObject["description"] = el.description;
        }
        if (el.part_number) {
          newObject["part_number"] = el.part_number;
        }
        if (el.bullet_point1) {
          newObject["bullet_point"].push(el.bullet_point1);
        }
        if (el.bullet_point2) {
          newObject["bullet_point"].push(el.bullet_point2);
        }
        if (el.bullet_point3) {
          newObject["bullet_point"].push(el.bullet_point3);
        }
        if (el.bullet_point4) {
          newObject["bullet_point"].push(el.bullet_point4);
        }
        if (el.bullet_point5) {
          newObject["bullet_point"].push(el.bullet_point5);
        }
        if (el.max_shelf_life) {
          newObject["max_shelf_life"] = el.max_shelf_life;
        }
        if (el.material_type_free1) {
          newObject["material_type_free"].push(el.material_type_free1);
        }
        if (el.material_type_free2) {
          newObject["material_type_free"].push(el.material_type_free2);
        }
        if (el.material_type_free3) {
          newObject["material_type_free"].push(el.material_type_free3);
        }
        if (el.material_composition) {
          newObject["material_composition"] = el.material_composition;
        }
        if (el.is_waterproof) {
          newObject["is_waterproof"] = (el.is_waterproof == 'true');
        }
        if (el.manufacturer) {
          newObject["manufacturer"] = el.manufacturer;
        }
        if (el.packer_details) {
          newObject["packer_details"] = el.packer_details;
        }
        if (el.importer_details) {
          newObject["importer_details"] = el.importer_details;
        }
        if (el.number_of_boxes) {
          newObject["number_of_boxes"] = el.number_of_boxes;
        }
        if (el.country_of_origin) {
          newObject["country_of_origin"] = el.country_of_origin;
        }
        if (el.product_information) {
          newObject["product_information"] = el.product_information;
        }
        if (el.fulfillment_latency) {
          newObject["fulfillment_latency"] = el.fulfillment_latency;
        }
        if (el.max_order_quantity) {
          newObject["max_order_quantity"] = el.max_order_quantity;
        }
        if (el.safety_information) {
          newObject["safety_information"] = el.safety_information;
        }
        if (el.indications) {
          newObject["indications"] = el.indications;
        }
        if (el.directions) {
          newObject["directions"] = el.directions;
        }
        if (el.legal_disclaimer) {
          newObject["legal_disclaimer"] = el.legal_disclaimer;
        }
        if (
          el.relationship_type1 &&
          el.variation_theme1 &&
          el.variation_Value1
        ) {
          let variations1 = {
            var_type: el.relationship_type1,
            var_theme_type: el.variation_theme1,
            data: [el.variation_Value1],
          };
          newObject["variations1"] = variations1;
          childrenObject["variation1"] = {
            var_title: el.variation_theme1,
            value: el.variation_Value1,
          };
        }
        if (
          el.relationship_type2 &&
          el.variation_theme2 &&
          el.variation_Value2
        ) {
          let variations2 = {
            var_type: el.relationship_type2,
            var_theme_type: el.variation_theme2,
            data: [el.variation_Value2],
          };
          newObject["variations2"] = variations2;
          childrenObject["variation2"] = {
            var_title: el.variation_theme2,
            value: el.variation_Value2,
          };
        }

        // Images {image}
        if (el.other_image_url1) {
          childrenObject["images"].push(el.other_image_url1);
        }
        if (el.other_image_url2) {
          childrenObject["images"].push(el.other_image_url2);
        }
        if (el.other_image_url3) {
          childrenObject["images"].push(el.other_image_url3);
        }
        if (el.other_image_url4) {
          childrenObject["images"].push(el.other_image_url4);
        }
        if (el.other_image_url5) {
          childrenObject["images"].push(el.other_image_url5);
        }
        if (el.other_image_url6) {
          childrenObject["images"].push(el.other_image_url6);
        }
        if (el.other_image_url7) {
          childrenObject["images"].push(el.other_image_url7);
        }
        if (el.other_image_url8) {
          childrenObject["images"].push(el.other_image_url8);
        }

        // Dimentions {dimensions}
        if (el.item_length) {
          childrenObject["dimensions"]["item_length"] = el.item_length;
        }
        if (el.item_width) {
          childrenObject["dimensions"]["item_width"] = el.item_width;
        }
        if (el.item_height) {
          childrenObject["dimensions"]["item_height"] = el.item_height;
        }
        if (el.item_weight) {
          childrenObject["dimensions"]["item_weight"] = el.item_weight;
        }

        // Price, Selling Price and Discount
        if (el.price_in_india && el.selling_price_in_india) {
          childrenObject["price"]["price_in_india"] = el.price_in_india;
          childrenObject["sellingPrice"]["selling_price_in_india"] =
            el.selling_price_in_india;
          childrenObject["discount"]["discount_price_in_india"] =
            100 -
            Math.round((el.selling_price_in_india / el.price_in_india) * 100);
        }
        if (el.price_in_unitedkingdom && el.selling_price_in_unitedkingdom) {
          childrenObject["price"]["price_in_unitedkingdom"] =
            el.price_in_unitedkingdom;
          childrenObject["sellingPrice"]["selling_price_in_unitedkingdom"] =
            el.selling_price_in_unitedkingdom;
          childrenObject["discount"]["discount_price_in_unitedkingdom"] =
            100 -
            Math.round(
              (el.selling_price_in_unitedkingdom / el.price_in_unitedkingdom) *
                100
            );
        }
        if (el.price_in_france && el.selling_price_in_france) {
          childrenObject["price"]["price_in_france"] = el.price_in_france;
          childrenObject["sellingPrice"]["selling_price_in_france"] =
            el.selling_price_in_france;
          childrenObject["discount"]["discount_price_in_france"] =
            100 -
            Math.round((el.selling_price_in_france / el.price_in_france) * 100);
        }
        if (el.price_in_germany && el.selling_price_in_germany) {
          childrenObject["price"]["price_in_germany"] = el.price_in_germany;
          childrenObject["sellingPrice"]["selling_price_in_germany"] =
            el.selling_price_in_germany;
          childrenObject["discount"]["discount_price_in_germany"] =
            100 -
            Math.round(
              (el.selling_price_in_germany / el.price_in_germany) * 100
            );
        }
        if (el.price_in_netherland && el.selling_price_in_netherland) {
          childrenObject["price"]["price_in_netherland"] =
            el.price_in_netherland;
          childrenObject["sellingPrice"]["selling_price_in_netherland"] =
            el.selling_price_in_netherland;
          childrenObject["discount"]["discount_price_in_netherland"] =
            100 -
            Math.round(
              (el.selling_price_in_netherland / el.price_in_netherland) * 100
            );
        }
        if (el.price_in_switzerland && el.selling_price_in_switzerland) {
          childrenObject["price"]["price_in_switzerland"] =
            el.price_in_switzerland;
          childrenObject["sellingPrice"]["selling_price_in_switzerland"] =
            el.selling_price_in_switzerland;
          childrenObject["discount"]["discount_price_in_switzerland"] =
            100 -
            Math.round(
              (el.selling_price_in_switzerland / el.price_in_switzerland) * 100
            );
        }
        if (el.price_in_italy && el.selling_price_in_italy) {
          childrenObject["price"]["price_in_italy"] = el.price_in_italy;
          childrenObject["sellingPrice"]["selling_price_in_italy"] =
            el.selling_price_in_italy;
          childrenObject["discount"]["discount_price_in_italy"] =
            100 -
            Math.round((el.selling_price_in_italy / el.price_in_italy) * 100);
        }
        if (el.price_in_canada && el.selling_price_in_canada) {
          childrenObject["price"]["price_in_canada"] = el.price_in_canada;
          childrenObject["sellingPrice"]["selling_price_in_canada"] =
            el.selling_price_in_canada;
          childrenObject["discount"]["discount_price_in_canada"] =
            100 -
            Math.round((el.selling_price_in_canada / el.price_in_canada) * 100);
        }
        if (el.price_in_unitedstate && el.selling_price_in_unitedstate) {
          childrenObject["price"]["price_in_unitedstate"] =
            el.price_in_unitedstate;
          childrenObject["sellingPrice"]["selling_price_in_unitedstate"] =
            el.selling_price_in_unitedstate;
          childrenObject["discount"]["discount_price_in_unitedstate"] =
            100 -
            Math.round(
              (el.selling_price_in_unitedstate / el.price_in_unitedstate) * 100
            );
        }

        if (el.banner) {
          childrenObject["banner"] = el.banner;
        }

        newObject["variations"].push(childrenObject);

        newProducts.push(newObject);
      } else if (el.parent_child == "Child") {
        let parentEle = newProducts[newProducts.length - 1]
        let childrenObject = {};

        childrenObject["images"] = [];
        childrenObject["dimensions"] = {};
        childrenObject["price"] = {};
        childrenObject["sellingPrice"] = {};
        childrenObject["discount"] = {};

        if(el.variation_theme1 != parentEle["variations1"].var_theme_type || el.variation_theme2 != parentEle["variations2"].var_theme_type){
          return false
        }
        if (el.banner) {
          childrenObject["banner"] = el.banner;
        }
        if (
          el.variation_theme1 &&
          el.variation_Value1
        ) {
          let checkVariation = parentEle["variations1"].data.includes(el.variation_Value1)
          if(!checkVariation){
            parentEle["variations1"].data.push(el.variation_Value1)
          }
          childrenObject["variation1"] = {
            var_title: el.variation_theme1,
            value: el.variation_Value1,
          };
        }
        if (
          el.variation_theme2 &&
          el.variation_Value2
        ) {
          let checkVariation = parentEle["variations2"].data.includes(el.variation_Value2)
          if(!checkVariation){
            parentEle["variations2"].data.push(el.variation_Value2)
          }
          childrenObject["variation2"] = {
            var_title: el.variation_theme2,
            value: el.variation_Value2,
          };
        }

        // quantity
        if (el.quantity) {
          childrenObject['quantity'] = el.quantity
        }

        // Images {image}
        if (el.other_image_url1) {
          childrenObject["images"].push(el.other_image_url1);
        }
        if (el.other_image_url2) {
          childrenObject["images"].push(el.other_image_url2);
        }
        if (el.other_image_url3) {
          childrenObject["images"].push(el.other_image_url3);
        }
        if (el.other_image_url4) {
          childrenObject["images"].push(el.other_image_url4);
        }
        if (el.other_image_url5) {
          childrenObject["images"].push(el.other_image_url5);
        }
        if (el.other_image_url6) {
          childrenObject["images"].push(el.other_image_url6);
        }
        if (el.other_image_url7) {
          childrenObject["images"].push(el.other_image_url7);
        }
        if (el.other_image_url8) {
          childrenObject["images"].push(el.other_image_url8);
        }

        // Dimentions {dimensions}
        if (el.item_length) {
          childrenObject["dimensions"]["item_length"] = el.item_length;
        }
        if (el.item_width) {
          childrenObject["dimensions"]["item_width"] = el.item_width;
        }
        if (el.item_height) {
          childrenObject["dimensions"]["item_height"] = el.item_height;
        }
        if (el.item_weight) {
          childrenObject["dimensions"]["item_weight"] = el.item_weight;
        }

        // Price, Selling Price and Discount
        if (el.price_in_india && el.selling_price_in_india) {
          childrenObject["price"]["price_in_india"] = el.price_in_india;
          childrenObject["sellingPrice"]["selling_price_in_india"] =
            el.selling_price_in_india;
          childrenObject["discount"]["discount_price_in_india"] =
            100 -
            Math.round((el.selling_price_in_india / el.price_in_india) * 100);
        }
        if (el.price_in_unitedkingdom && el.selling_price_in_unitedkingdom) {
          childrenObject["price"]["price_in_unitedkingdom"] =
            el.price_in_unitedkingdom;
          childrenObject["sellingPrice"]["selling_price_in_unitedkingdom"] =
            el.selling_price_in_unitedkingdom;
          childrenObject["discount"]["discount_price_in_unitedkingdom"] =
            100 -
            Math.round(
              (el.selling_price_in_unitedkingdom / el.price_in_unitedkingdom) *
                100
            );
        }
        if (el.price_in_france && el.selling_price_in_france) {
          childrenObject["price"]["price_in_france"] = el.price_in_france;
          childrenObject["sellingPrice"]["selling_price_in_france"] =
            el.selling_price_in_france;
          childrenObject["discount"]["discount_price_in_france"] =
            100 -
            Math.round((el.selling_price_in_france / el.price_in_france) * 100);
        }
        if (el.price_in_germany && el.selling_price_in_germany) {
          childrenObject["price"]["price_in_germany"] = el.price_in_germany;
          childrenObject["sellingPrice"]["selling_price_in_germany"] =
            el.selling_price_in_germany;
          childrenObject["discount"]["discount_price_in_germany"] =
            100 -
            Math.round(
              (el.selling_price_in_germany / el.price_in_germany) * 100
            );
        }
        if (el.price_in_netherland && el.selling_price_in_netherland) {
          childrenObject["price"]["price_in_netherland"] =
            el.price_in_netherland;
          childrenObject["sellingPrice"]["selling_price_in_netherland"] =
            el.selling_price_in_netherland;
          childrenObject["discount"]["discount_price_in_netherland"] =
            100 -
            Math.round(
              (el.selling_price_in_netherland / el.price_in_netherland) * 100
            );
        }
        if (el.price_in_switzerland && el.selling_price_in_switzerland) {
          childrenObject["price"]["price_in_switzerland"] =
            el.price_in_switzerland;
          childrenObject["sellingPrice"]["selling_price_in_switzerland"] =
            el.selling_price_in_switzerland;
          childrenObject["discount"]["discount_price_in_switzerland"] =
            100 -
            Math.round(
              (el.selling_price_in_switzerland / el.price_in_switzerland) * 100
            );
        }
        if (el.price_in_italy && el.selling_price_in_italy) {
          childrenObject["price"]["price_in_italy"] = el.price_in_italy;
          childrenObject["sellingPrice"]["selling_price_in_italy"] =
            el.selling_price_in_italy;
          childrenObject["discount"]["discount_price_in_italy"] =
            100 -
            Math.round((el.selling_price_in_italy / el.price_in_italy) * 100);
        }
        if (el.price_in_canada && el.selling_price_in_canada) {
          childrenObject["price"]["price_in_canada"] = el.price_in_canada;
          childrenObject["sellingPrice"]["selling_price_in_canada"] =
            el.selling_price_in_canada;
          childrenObject["discount"]["discount_price_in_canada"] =
            100 -
            Math.round((el.selling_price_in_canada / el.price_in_canada) * 100);
        }
        if (el.price_in_unitedstate && el.selling_price_in_unitedstate) {
          childrenObject["price"]["price_in_unitedstate"] =
            el.price_in_unitedstate;
          childrenObject["sellingPrice"]["selling_price_in_unitedstate"] =
            el.selling_price_in_unitedstate;
          childrenObject["discount"]["discount_price_in_unitedstate"] =
            100 -
            Math.round(
              (el.selling_price_in_unitedstate / el.price_in_unitedstate) * 100
            );
        }

        if(newProducts.length){
          parentEle.variations.push(childrenObject)
        }

      }
    });

    // await newProducts
    let addNewProducts = await Product.insertMany(newProducts)

    res.status(200).json({
      statusMessage: "success",
      body: addNewProducts
    });
  } catch (err) {
    res.status(404).json({
      statusMessage: "fail",
      message: err.message,
    });
  }
};

//UPDATE
exports.doUpdate = async (req, res) => {
  try {
    const condition = {
      _id: req.body.product,
    };
    if ((req.role = "Seller")) {
      condition.seller = req.SellerAuth._id;
    }
    delete req.body.product;

    const updateFields = Object.keys(req.body);
    const allowFields = [
      "category",
      "title",
      "price",
      "productStatus",
      "sellingPrice",
      "description",
      "features",
      "quantity",
      "banner",
      "images",
      "status",
    ];
    const validations = updateFields.every((update) =>
      allowFields.includes(update)
    );
    if (!validations) throw new Error("Invalid Arguments");

    const product = await Model._findOne(_Products, condition, {}, false);
    if (!product) throw new Error("Product not found");

    if (req.body.sellingPrice && req.body.sellingPrice !== "") {
      req.body.discount =
        ((product.price - req.body.sellingPrice) / product.price) * 100;
    }
    if (req.body.price && req.body.price !== "") {
      req.body.discount =
        ((req.body.price - product.sellingPrice) / req.body.price) * 100;
    }
    if (
      req.body.sellingPrice &&
      req.body.sellingPrice !== "" &&
      req.body.price &&
      req.body.price !== ""
    ) {
      req.body.discount =
        ((req.body.price - req.body.sellingPrice) / req.body.price) * 100;
    }

    if (req.body.discount && req.body.discount <= 0)
      throw new Error("Discount must be greater than zero");
    // if (req.body.quantity == 0) {
    //     product.status = 'Out of stock'
    // }
    if (req.body.quantity && req.body.quantity !== 0) {
      req.body.status = "In stock";
    }

    // if (product.status == 'Out of stock' || req.body.status == 'Out of stock') {
    //     product.quantity = 0
    // }

    Object.keys(req.body).map((field) => {
      product[field] = req.body[field];
    });
    // Banner
    if (req.files && req.files.banner && req.files.banner.length !== 0) {
      product.banner = req.files.banner[0].filename;
    }

    if (req.files && req.files.images) {
      var productImages = [];
      req.files.images.map((file) => {
        productImages.push(file.filename);
      });
      product.images = productImages;
    }

    var updatedProducts = await product.save();
    _.res(res, updatedProducts, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//GET
exports.getProduct = async (req, res) => {
  try {
    var condition = {
      _id: req.body.product,
      seller: req.SellerAuth._id,
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
    if (!product) throw new Error("Unable to find product");

    _.res(res, product, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//GETS
exports.getProducts = async (req, res) => {
  try {
    const condition = {
      seller: req.SellerAuth._id,
    };
    if (req.body.productStatus && req.body.productStatus !== "") {
      condition.productStatus = req.body.productStatus;
    }

    const options = [
      {
        populate: {
          path: "parentId",
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
              _id: +req.body.sort[k],
            },
          });
        }
      });
    }

    var search = new RegExp(req.body.search, "gi");
    if (req.body.search && req.body.search !== "") {
      condition[
        "$where"
      ] = `function() { return this.title.match(${search}) != null || this.price.toString().match(${search}) != null || 
            this.sellingPrice.toString().match(${search}) != null || 
            this.discount.toString().match(${search}) != null || this.quantity.toString().match(${search}) != null || 
            this.description.match(${search}) != null || 
            this.features.match(${search}) != null || this.status.match(${search}) != null || 
            this.createdAt.toString().match(${search}) != null;}`;
    }

    const product = await Model._find(_Products, condition, options, false);
    if (!product) throw new Error("Product not found");

    _.res(res, product, 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

//REMOVE
exports.removeProduct = async (req, res) => {
  try {
    const condition = {
      _id: req.body.product,
      seller: req.SellerAuth._id,
    };

    const product = await Model._findOne(_Products, condition, {}, false);
    if (!product)
      throw new Error("Oops ! Something went wrong,Maybe be Already Removed");

    product.remove();

    _.res(res, "Product removed successfully", 200);
  } catch (error) {
    _.res(res, error.message, 404);
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    let category = await Categories.find();

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
