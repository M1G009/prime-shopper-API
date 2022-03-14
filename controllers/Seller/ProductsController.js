let fs = require('fs')
let path = require('path')
const csv = require("fast-csv");
const Categories = require('../../models/schemas/DynamicCategoriesSchema');

//ADD
exports.doAdd = async (req, res) => {
    try {
        req.body = _._form(req.body);
        var required = ["category", "title", "price", "sellingPrice"]
        var validate = _._checkFields(req.body, required)
        if (validate !== true) throw new Error(validate.message)

        // console.log(req.body);

        res.status(200).json({
            message: "success"
        })

        // if (req.files && req.files.banner && req.files.banner.length !== 0) {
        //     req.body.banner = req.files.banner[0].filename;
        // }
        // console.log(req.files.images);
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
        // console.log("data1", data);
        // const addProduct = await Model._create(_Products, data)
        // console.log(addProduct);
        // // const addProduct = ''
        // if (!addProduct) {
        //     throw new Error('Invalid Arguments')
        // }

        // _.res(res, addProduct, 200);

    } catch (error) {
        _.res(res, error.message, 404)
    }
}

//ADD With CSV
exports.doAddCSV = async (req, res) => {
    try {
        if(!req.file){
            throw new Error("please upload file")
        }
        let csvPath = path.join(__dirname, '..', '..', 'public', 'csv', req.file.filename)
        // console.log(csvPath);

        let csvData = [];
        fs.createReadStream(csvPath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                // console.log("row", row);
                csvData.push(row);
            })
            .on("end", () => {
                console.log("csvData", csvData);
                res.status(200).send({
                    message:
                        "Uploaded the file successfully: " + req.file.originalname,
                });
            });

        // res.status(200).json({
        //     statusMessage: "success",
        //     body: "data"
        // })

    } catch (err) {
        res.status(404).json({
            statusMessage: "fail",
            message: err.message
        })
    }
}

//UPDATE
exports.doUpdate = async (req, res) => {
    try {
        const condition = {
            _id: req.body.product,
        }
        if (req.role = 'Seller') {
            condition.seller = req.SellerAuth._id
        }
        delete req.body.product

        const updateFields = Object.keys(req.body);
        const allowFields = ["category", "title", "price", "productStatus", "sellingPrice", "description", "features", "quantity", "banner", "images", "status"];
        const validations = updateFields.every((update) => allowFields.includes(update));
        if (!validations) throw new Error('Invalid Arguments')

        const product = await Model._findOne(_Products, condition, {}, false);
        if (!product) throw new Error('Product not found');

        if (req.body.sellingPrice && req.body.sellingPrice !== '') {
            req.body.discount = (product.price - req.body.sellingPrice) / product.price * 100;
        }
        if (req.body.price && req.body.price !== '') {
            req.body.discount = (req.body.price - product.sellingPrice) / req.body.price * 100;
        }
        if (req.body.sellingPrice && req.body.sellingPrice !== '' && req.body.price && req.body.price !== '') {
            req.body.discount = (req.body.price - req.body.sellingPrice) / req.body.price * 100;
        }

        if (req.body.discount && req.body.discount <= 0) throw new Error('Discount must be greater than zero')
        // if (req.body.quantity == 0) {
        //     product.status = 'Out of stock'
        // }
        if (req.body.quantity && req.body.quantity !== 0) {
            req.body.status = 'In stock'
        }

        // if (product.status == 'Out of stock' || req.body.status == 'Out of stock') {
        //     product.quantity = 0
        // }

        Object.keys(req.body).map(field => {
            product[field] = req.body[field]
        });
        // Banner
        if (req.files && req.files.banner && req.files.banner.length !== 0) {
            product.banner = req.files.banner[0].filename;
        }

        if (req.files && req.files.images) {
            var productImages = []
            req.files.images.map(file => {
                productImages.push(file.filename)
            })
            product.images = productImages;
        }

        var updatedProducts = await product.save();
        _.res(res, updatedProducts, 200)

    } catch (error) {
        _.res(res, error.message, 404)
    }
}

//GET
exports.getProduct = async (req, res) => {
    try {
        var condition = {
            _id: req.body.product,
            seller: req.SellerAuth._id
        }
        const options = [
            {
                populate: {
                    path: 'category',
                }
            },
            {
                populate: {
                    path: 'isFavorite',
                    select: 'title banner images'
                }
            },
            {
                populate: {
                    path: 'seller'
                }
            }
        ]
        const product = await Model._findOne(_Products, condition, options, false)
        if (!product) throw new Error('Unable to find product')

        _.res(res, product, 200)
    } catch (error) {
        _.res(res, error.message, 404)
    }
}

//GETS
exports.getProducts = async (req, res) => {
    try {
        const condition = {
            seller: req.SellerAuth._id
        }
        if (req.body.productStatus && req.body.productStatus !== '') {
            condition.productStatus = req.body.productStatus
        }

        const options = [
            {
                populate: {
                    path: 'category',
                }
            },
            {
                populate: {
                    path: 'isFavorite',
                    select: 'product',
                    populate: {
                        path: 'product',
                        select: 'title banner images'
                    }
                }
            },
            {
                populate: {
                    path: 'seller'
                }
            },
            { limit: 12 },
            { skip: req.body.skip ? req.body.skip : 0 }
        ]

        if (req.body.sort && req.body.sort !== '') {
            Object.keys(req.body.sort).map(k => {
                if (req.body.sort[k] !== '') {
                    options.push(
                        {
                            sort: {
                                [k]: +req.body.sort[k],
                                _id: +req.body.sort[k]
                            }
                        }
                    )
                }
            })
        }

        console.log(options);
        var search = new RegExp(req.body.search, 'gi');
        if (req.body.search && req.body.search !== '') {
            condition['$where'] = `function() { return this.title.match(${search}) != null || this.price.toString().match(${search}) != null || 
            this.sellingPrice.toString().match(${search}) != null || 
            this.discount.toString().match(${search}) != null || this.quantity.toString().match(${search}) != null || 
            this.description.match(${search}) != null || 
            this.features.match(${search}) != null || this.status.match(${search}) != null || 
            this.createdAt.toString().match(${search}) != null;}`
        }

        const product = await Model._find(_Products, condition, options, false)
        if (!product) throw new Error('Product not found')

        _.res(res, product, 200)
    } catch (error) {
        _.res(res, error.message, 404)
    }
}

//REMOVE
exports.removeProduct = async (req, res) => {
    try {
        const condition = {
            _id: req.body.product,
            seller: req.SellerAuth._id
        }

        const product = await Model._findOne(_Products, condition, {}, false)
        if (!product) throw new Error('Oops ! Something went wrong,Maybe be Already Removed')

        product.remove()

        _.res(res, 'Product removed successfully', 200)

    } catch (error) {
        _.res(res, error.message, 404)
    }
}

exports.getSubCategory = async (req, res) => {
    try {

        let category = await Categories.find();

        res.status(200).json({
            status: 'success',
            data: category
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}