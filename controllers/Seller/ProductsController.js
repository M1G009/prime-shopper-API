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

    let productdata = req.body;
    let AllFiles = req.files;

    let productImages = [];

    if (AllFiles.images && AllFiles.images.length) {
      AllFiles.images.map((el) => {
        if (el.filename) {
          return productImages.push(
            `https://api.datavidhya.com/temp/${el.filename}`
          );
        }
      });
    }

    let newProduct = {
      category: productdata.category ? productdata.category : "",
      parentId: productdata.parentId ? productdata.parentId : "",
      seller: req.SellerAuth._id ? req.SellerAuth._id : "",
      title: productdata.title ? productdata.title : "",
      sku: productdata.sku ? productdata.sku : "",
      description: productdata.description ? productdata.description : "",
      status: productdata.status ? productdata.status : "",
      productStatus: "Active",
      slug: "",
      brand_name: productdata.brand_name ? productdata.brand_name : "",
      external_product_id: productdata.external_product_id
        ? productdata.external_product_id
        : "",
      external_product_id_type: productdata.external_product_id_type
        ? productdata.external_product_id_type
        : "",
      part_number: productdata.part_number ? productdata.part_number : "",
      bullet_point: productdata.bullet_point.length
        ? productdata.bullet_point
        : "",
      max_shelf_life: productdata.max_shelf_life
        ? productdata.max_shelf_life
        : "",
      material_type_free: productdata.material_type_free.length
        ? productdata.material_type_free
        : "",
      material_composition: productdata.material_composition
        ? productdata.material_composition
        : "",
      is_waterproof: productdata.is_waterproof
        ? productdata.is_waterproof == "true"
        : false,
      manufacturer: productdata.manufacturer ? productdata.manufacturer : "",
      packer_details: productdata.packer_details
        ? productdata.packer_details
        : "",
      number_of_boxes: productdata.number_of_boxes
        ? productdata.number_of_boxes
        : "",
      country_of_origin: productdata.country_of_origin
        ? productdata.country_of_origin
        : "",
      product_information: productdata.product_information
        ? productdata.product_information
        : "",
      fulfillment_latency: productdata.fulfillment_latency
        ? productdata.fulfillment_latency
        : "",
      max_order_quantity: productdata.max_order_quantity
        ? productdata.max_order_quantity
        : "",
      safety_information: productdata.safety_information
        ? productdata.safety_information
        : "",
      indications: productdata.indications ? productdata.indications : "",
      directions: productdata.directions ? productdata.directions : "",
      legal_disclaimer: productdata.legal_disclaimer
        ? productdata.legal_disclaimer
        : "",
      variations1: {
        var_type: productdata.relationship_type1
          ? productdata.relationship_type1
          : "",
        var_theme_type: productdata.variation_theme1
          ? productdata.variation_theme1
          : "",
        data: [
          productdata.variation_Value1 ? productdata.variation_Value1 : "",
        ],
      },
      variations2: {
        var_type: productdata.relationship_type2
          ? productdata.relationship_type2
          : "",
        var_theme_type: productdata.variation_theme2
          ? productdata.variation_theme2
          : "",
        data: [
          productdata.variation_Value2 ? productdata.variation_Value2 : "",
        ],
      },
      variations: [
        {
          banner:
            AllFiles.banner[0] && AllFiles.banner[0].filename
              ? `https://api.datavidhya.com/temp/${AllFiles.banner[0].filename}`
              : "",
          Colour: productdata.Colour ? productdata.Colour : "",
          variation1: {
            var_title: productdata.variation_theme1
              ? productdata.variation_theme1
              : "",
            value: productdata.variation_Value1
              ? productdata.variation_Value1
              : "",
          },
          variation2: {
            var_title: productdata.variation_theme2
              ? productdata.variation_theme2
              : "",
            value: productdata.variation_Value2
              ? productdata.variation_Value2
              : "",
          },
          quantity: productdata.quantity ? productdata.quantity : "",
          images: productImages,
          dimensions: {
            item_length: productdata.item_length
              ? productdata.item_length * 1
              : "",
            item_width: productdata.item_width
              ? productdata.item_width * 1
              : "",
            item_height: productdata.item_height
              ? productdata.item_height * 1
              : "",
            item_weight: productdata.item_weight
              ? productdata.item_weight * 1
              : "",
          },
          price: {
            price_in_india: "",
            price_in_unitedkingdom: "",
            price_in_france: "",
            price_in_germany: "",
            price_in_netherland: "",
            price_in_switzerland: "",
            price_in_italy: "",
            price_in_canada: "",
            price_in_unitedstate: "",
          },
          sellingPrice: {
            selling_price_in_india: "",
            selling_price_in_unitedkingdom: "",
            selling_price_in_france: "",
            selling_price_in_germany: "",
            selling_price_in_netherland: "",
            selling_price_in_switzerland: "",
            selling_price_in_italy: "",
            selling_price_in_canada: "",
            selling_price_in_unitedstate: "",
          },
          discount: {
            discount_price_in_india: "",
            discount_price_in_unitedkingdom: "",
            discount_price_in_france: "",
            discount_price_in_germany: "",
            discount_price_in_netherland: "",
            discount_price_in_switzerland: "",
            discount_price_in_italy: "",
            discount_price_in_canada: "",
            discount_price_in_unitedstate: "",
          },
        },
      ],
    };

    if (productdata.title) {
      newProduct.slug = slugify(productdata.title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      });
    }

    if (
      productdata.price_in_india &&
      productdata.selling_price_in_india &&
      productdata.price_in_india >= productdata.selling_price_in_india
    ) {
      productdata.variations[0].price.price_in_india =
        productdata.price_in_india * 1;
      productdata.variations[0].price.selling_price_in_india =
        productdata.selling_price_in_india * 1;
      productdata.variations[0].price.discount_price_in_india =
        (productdata.selling_price_in_india / productdata.price_in_india) * 100;
    }

    if (
      productdata.price_in_india &&
      productdata.selling_price_in_unitedkingdom &&
      productdata.price_in_unitedkingdom >=
        productdata.selling_price_in_unitedkingdom
    ) {
      productdata.variations[0].price.price_in_unitedkingdom =
        productdata.price_in_unitedkingdom * 1;
      productdata.variations[0].price.selling_price_in_unitedkingdom =
        productdata.selling_price_in_unitedkingdom * 1;
      productdata.variations[0].price.discount_price_in_unitedkingdom =
        (productdata.selling_price_in_unitedkingdom /
          productdata.price_in_unitedkingdom) *
        100;
    }
    if (
      productdata.price_in_france &&
      productdata.selling_price_in_france &&
      productdata.price_in_france >= productdata.selling_price_in_france
    ) {
      productdata.variations[0].price.price_in_france =
        productdata.price_in_france * 1;
      productdata.variations[0].price.selling_price_in_france =
        productdata.selling_price_in_france * 1;
      productdata.variations[0].price.discount_price_in_france =
        (productdata.selling_price_in_france / productdata.price_in_france) *
        100;
    }

    if (
      productdata.price_in_germany &&
      productdata.selling_price_in_germany &&
      productdata.price_in_germany >= productdata.selling_price_in_germany
    ) {
      productdata.variations[0].price.price_in_germany =
        productdata.price_in_germany * 1;
      productdata.variations[0].price.selling_price_in_germany =
        productdata.selling_price_in_germany * 1;
      productdata.variations[0].price.discount_price_in_germany =
        (productdata.selling_price_in_germany / productdata.price_in_germany) *
        100;
    }

    if (
      productdata.price_in_netherland &&
      productdata.selling_price_in_netherland &&
      productdata.price_in_netherland >= productdata.selling_price_in_netherland
    ) {
      productdata.variations[0].price.price_in_netherland =
        productdata.price_in_netherland * 1;
      productdata.variations[0].price.selling_price_in_netherland =
        productdata.selling_price_in_netherland * 1;
      productdata.variations[0].price.discount_price_in_netherland =
        (productdata.selling_price_in_netherland /
          productdata.price_in_netherland) *
        100;
    }

    if (
      productdata.price_in_switzerland &&
      productdata.selling_price_in_switzerland &&
      productdata.price_in_switzerland >=
        productdata.selling_price_in_switzerland
    ) {
      productdata.variations[0].price.price_in_switzerland =
        productdata.price_in_switzerland * 1;
      productdata.variations[0].price.selling_price_in_switzerland =
        productdata.selling_price_in_switzerland * 1;
      productdata.variations[0].price.discount_price_in_switzerland =
        (productdata.selling_price_in_switzerland /
          productdata.price_in_switzerland) *
        100;
    }

    if (
      productdata.price_in_italy &&
      productdata.selling_price_in_italy &&
      productdata.price_in_italy >= productdata.selling_price_in_italy
    ) {
      productdata.variations[0].price.price_in_italy =
        productdata.price_in_italy * 1;
      productdata.variations[0].price.selling_price_in_italy =
        productdata.selling_price_in_italy * 1;
      productdata.variations[0].price.discount_price_in_italy =
        (productdata.selling_price_in_italy / productdata.price_in_italy) * 100;
    }

    if (
      productdata.price_in_canada &&
      productdata.selling_price_in_canada &&
      productdata.price_in_canada >= productdata.selling_price_in_canada
    ) {
      productdata.variations[0].price.price_in_canada =
        productdata.price_in_canada * 1;
      productdata.variations[0].price.selling_price_in_canada =
        productdata.selling_price_in_canada * 1;
      productdata.variations[0].price.discount_price_in_canada =
        (productdata.selling_price_in_canada / productdata.price_in_canada) *
        100;
    }

    if (
      productdata.price_in_unitedstate &&
      productdata.selling_price_in_unitedstate &&
      productdata.price_in_unitedstate >=
        productdata.selling_price_in_unitedstate
    ) {
      productdata.variations[0].price.price_in_unitedstate =
        productdata.price_in_unitedstate * 1;
      productdata.variations[0].price.selling_price_in_unitedstate =
        productdata.selling_price_in_unitedstate * 1;
      productdata.variations[0].price.discount_price_in_unitedstate =
        (productdata.selling_price_in_unitedstate /
          productdata.price_in_unitedstate) *
        100;
    }

    let addProduct = await Product.create(newProduct);

    _.res(res, addProduct, 200);
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
        childrenObject["variation1"] = {
          var_title: "",
          value: "",
        };
        childrenObject["variation2"] = {
          var_title: "",
          value: "",
        };

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
        if (el.bullet_point5) {
          newObject["bullet_point"].push(el.bullet_point6);
        }
        if (el.bullet_point5) {
          newObject["bullet_point"].push(el.bullet_point7);
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
          newObject["is_waterproof"] = el.is_waterproof == "true";
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
        let parentEle = newProducts[newProducts.length - 1];
        let childrenObject = {};

        childrenObject["images"] = [];
        childrenObject["dimensions"] = {};
        childrenObject["price"] = {};
        childrenObject["sellingPrice"] = {};
        childrenObject["discount"] = {};

        if (
          el.variation_theme1 != parentEle["variations1"].var_theme_type ||
          el.variation_theme2 != parentEle["variations2"].var_theme_type
        ) {
          return false;
        }
        if (el.banner) {
          childrenObject["banner"] = el.banner;
        }
        if (el.variation_theme1 && el.variation_Value1) {
          let checkVariation = parentEle["variations1"].data.includes(
            el.variation_Value1
          );
          if (!checkVariation) {
            parentEle["variations1"].data.push(el.variation_Value1);
          }
          childrenObject["variation1"] = {
            var_title: el.variation_theme1,
            value: el.variation_Value1,
          };
        }
        if (el.variation_theme2 && el.variation_Value2) {
          let checkVariation = parentEle["variations2"].data.includes(
            el.variation_Value2
          );
          if (!checkVariation) {
            parentEle["variations2"].data.push(el.variation_Value2);
          }
          childrenObject["variation2"] = {
            var_title: el.variation_theme2,
            value: el.variation_Value2,
          };
        }

        // quantity
        if (el.quantity) {
          childrenObject["quantity"] = el.quantity;
        }

        if (el.Colour) {
          childrenObject["Colour"] = el.Colour;
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

        if (newProducts.length) {
          parentEle.variations.push(childrenObject);
        }
      }
    });

    if (!newProducts.length) {
      throw new Error("Please add atleast one product in file");
    }
    // await newProducts
    let addNewProducts = await Product.insertMany(newProducts);

    res.status(200).json({
      statusMessage: "success",
      body: addNewProducts,
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
    req.body = _._form(req.body);

    let productdata = req.body;
    let AllFiles = req.files;
    if (productdata._id) {
      let checkProduct = await Product.findById(productdata._id).clone();

      if (!checkProduct) {
        throw new Error("Product Not Found");
      }
      let updateData = {};

      updateData.title = productdata.title;
      updateData.sku = productdata.sku;
      updateData.description = productdata.description;
      updateData.status = productdata.status;
      updateData.productStatus = productdata.productStatus;
      updateData.slug = slugify(productdata.title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      });
      updateData.feed_product_type = productdata.feed_product_type;
      updateData.brand_name = productdata.brand_name;
      updateData.external_product_id = productdata.external_product_id;
      updateData.external_product_id_type =
        productdata.external_product_id_type;
      updateData.part_number = productdata.part_number;
      updateData.bullet_point = productdata.bullet_point;
      updateData.max_shelf_life = productdata.max_shelf_life;
      updateData.material_type_free = productdata.material_type_free;
      updateData.material_composition = productdata.material_composition;
      updateData.is_waterproof = productdata.is_waterproof
        ? productdata.is_waterproof == "true"
        : false;
      updateData.manufacturer = productdata.manufacturer;
      updateData.packer_details = productdata.packer_details;
      updateData.importer_details = productdata.importer_details;
      updateData.number_of_boxes = productdata.number_of_boxes;
      updateData.country_of_origin = productdata.country_of_origin;
      updateData.product_information = productdata.product_information;
      updateData.fulfillment_latency = productdata.fulfillment_latency;
      updateData.max_order_quantity = productdata.max_order_quantity;
      updateData.safety_information = productdata.safety_information;
      updateData.indications = productdata.indications;
      updateData.directions = productdata.directions;
      updateData.legal_disclaimer = productdata.legal_disclaimer;

      let findVarient = checkProduct.variations.find(
        (el) => (el._id = productdata.varientId)
      );

      let updateVarient = Object.assign({}, findVarient._doc);

      updateVarient.variation1 = {
        var_title: productdata.variation_theme1
          ? productdata.variation_theme1
          : "",
        value: productdata.variation_Value1 ? productdata.variation_Value1 : "",
      };

      updateVarient.variation2 = {
        var_title: productdata.variation_theme2
          ? productdata.variation_theme2
          : "",
        value: productdata.variation_Value2 ? productdata.variation_Value2 : "",
      };

      updateVarient.dimensions = {
        item_length: productdata.item_length ? productdata.item_length * 1 : 0,
        item_width: productdata.item_width ? productdata.item_width * 1 : 0,
        item_height: productdata.item_height ? productdata.item_height * 1 : 0,
        item_weight: productdata.item_weight ? productdata.item_weight * 1 : 0,
      };

      updateVarient.quantity = productdata.quantity
        ? productdata.quantity * 1
        : 0;

        updateVarient.Colour = productdata.Colour
        ? productdata.Colour
        : "";

      if (AllFiles && AllFiles.images && AllFiles.images.length) {
        let productImages = [];
        AllFiles.images.map((el) => {
          if (el.filename) {
            return productImages.push(
              `https://api.datavidhya.com/temp/${el.filename}`
            );
          }
        });
        updateVarient.images = productImages;
      } else {
        updateVarient.images = findVarient.images;
      }

      if (
        AllFiles &&
        AllFiles.banner &&
        AllFiles.banner.length &&
        AllFiles.banner[0].filename
      ) {
        updateVarient.banner =
          AllFiles.banner[0] && AllFiles.banner[0].filename
            ? `https://api.datavidhya.com/temp/${AllFiles.banner[0].filename}`
            : "";
      } else {
        updateVarient.banner = findVarient.banner;
      }

      if (
        productdata.price_in_india &&
        productdata.selling_price_in_india &&
        productdata.price_in_india >= productdata.selling_price_in_india
      ) {
        updateVarient.price.price_in_india = productdata.price_in_india * 1;
        updateVarient.sellingPrice.selling_price_in_india =
          productdata.selling_price_in_india * 1;
        updateVarient.discount.discount_price_in_india =
          (productdata.selling_price_in_india / productdata.price_in_india) *
          100;
      }

      if (
        productdata.price_in_unitedkingdom &&
        productdata.selling_price_in_unitedkingdom &&
        productdata.price_in_unitedkingdom != null &&
        productdata.selling_price_in_unitedkingdom != null &&
        productdata.price_in_unitedkingdom >=
          productdata.selling_price_in_unitedkingdom
      ) {
        updateVarient.price.price_in_unitedkingdom =
          productdata.price_in_unitedkingdom * 1;
        updateVarient.sellingPrice.selling_price_in_unitedkingdom =
          productdata.selling_price_in_unitedkingdom * 1;
        updateVarient.discount.discount_price_in_unitedkingdom =
          (productdata.selling_price_in_unitedkingdom /
            productdata.price_in_unitedkingdom) *
          100;
      }

      if (
        productdata.price_in_france &&
        productdata.selling_price_in_france &&
        productdata.price_in_france >= productdata.selling_price_in_france
      ) {
        updateVarient.price.price_in_france = productdata.price_in_france * 1;
        updateVarient.sellingPrice.selling_price_in_france =
          productdata.selling_price_in_france * 1;
        updateVarient.discount.discount_price_in_france =
          (productdata.selling_price_in_france / productdata.price_in_france) *
          100;
      }

      if (
        productdata.price_in_germany &&
        productdata.selling_price_in_germany &&
        productdata.price_in_germany >= productdata.selling_price_in_germany
      ) {
        updateVarient.price.price_in_germany = productdata.price_in_germany * 1;
        updateVarient.sellingPrice.selling_price_in_germany =
          productdata.selling_price_in_germany * 1;
        updateVarient.discount.discount_price_in_germany =
          (productdata.selling_price_in_germany /
            productdata.price_in_germany) *
          100;
      }

      if (
        productdata.price_in_netherland &&
        productdata.selling_price_in_netherland &&
        productdata.price_in_netherland >=
          productdata.selling_price_in_netherland
      ) {
        updateVarient.price.price_in_netherland =
          productdata.price_in_netherland * 1;
        updateVarient.sellingPrice.selling_price_in_netherland =
          productdata.selling_price_in_netherland * 1;
        updateVarient.discount.discount_price_in_netherland =
          (productdata.selling_price_in_netherland /
            productdata.price_in_netherland) *
          100;
      }

      if (
        productdata.price_in_switzerland &&
        productdata.selling_price_in_switzerland &&
        productdata.price_in_switzerland >=
          productdata.selling_price_in_switzerland
      ) {
        updateVarient.price.price_in_switzerland =
          productdata.price_in_switzerland * 1;
        updateVarient.sellingPrice.selling_price_in_switzerland =
          productdata.selling_price_in_switzerland * 1;
        updateVarient.discount.discount_price_in_switzerland =
          (productdata.selling_price_in_switzerland /
            productdata.price_in_switzerland) *
          100;
      }

      if (
        productdata.price_in_italy &&
        productdata.selling_price_in_italy &&
        productdata.price_in_italy >= productdata.selling_price_in_italy
      ) {
        updateVarient.price.price_in_italy = productdata.price_in_italy * 1;
        updateVarient.sellingPrice.selling_price_in_italy =
          productdata.selling_price_in_italy * 1;
        updateVarient.discount.discount_price_in_italy =
          (productdata.selling_price_in_italy / productdata.price_in_italy) *
          100;
      }

      if (
        productdata.price_in_canada &&
        productdata.selling_price_in_canada &&
        productdata.price_in_canada >= productdata.selling_price_in_canada
      ) {
        updateVarient.price.price_in_canada = productdata.price_in_canada * 1;
        updateVarient.sellingPrice.selling_price_in_canada =
          productdata.selling_price_in_canada * 1;
        updateVarient.discount.discount_price_in_canada =
          (productdata.selling_price_in_canada / productdata.price_in_canada) *
          100;
      }

      if (
        productdata.price_in_unitedstate &&
        productdata.selling_price_in_unitedstate &&
        productdata.price_in_unitedstate >=
          productdata.selling_price_in_unitedstate
      ) {
        updateVarient.price.price_in_unitedstate =
          productdata.price_in_unitedstate * 1;
        updateVarient.sellingPrice.selling_price_in_unitedstate =
          productdata.selling_price_in_unitedstate * 1;
        updateVarient.discount.discount_price_in_unitedstate =
          (productdata.selling_price_in_unitedstate /
            productdata.price_in_unitedstate) *
          100;
      }

      if (updateData && updateData.variations && updateData.variations.length) {
        let val1Array = [];
        let val2Array = [];
        updateData.variations.map((el) => {
          let val1 = el.variation1.value;
          let val2 = el.variation2.value;

          if (!val1Array.includes(val1)) {
            val1Array.push(val1);
          }
          if (!val2Array.includes(val2)) {
            val2Array.push(val2);
          }
        });

        updateData.variations1.data = val1Array;
        updateData.variations2.data = val2Array;
      }
      let updatedateArray = await Product.findByIdAndUpdate(productdata._id, {
        ...updateData,
        variations: updateVarient,
      });

      return _.res(res, updatedateArray, 200);
    }

    _.res(res, updateVarient, 200);
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
