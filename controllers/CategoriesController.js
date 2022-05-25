const Categories = require("./../models/schemas/DynamicCategoriesSchema");

exports.getCategory = async (req, res) => {
  try {
    const condition = {
      _id: req.body.category,
    };

    const options = [
      {
        populate: {
          path: "dean",
          select: "name image banner",
        },
      },
      {
        populate: {
          path: "hasForm",
        },
      },
    ];
    const category = await Model._findOne(_Category, condition, options, {});
    if (!category) throw new Error("Category Not Found");

    _.res(res, category, 200);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

exports.getCategories = async (req, res) => {
  try {
    let allCategory = await Categories.find();

    res.status(200).json({
      status: "success",
      data: allCategory,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getSubcategoriesByCategories = async (req, res) => {
  try {
    const condition = {
      dean: req.body.category,
      type: "SubCategory",
    };
    const options = [
      {
        populate: {
          path: "dean",
          select: "name image banner",
        },
      },
      {
        populate: {
          path: "hasForm",
        },
      },
    ];
    const getSubcategoryByCategories = await Model._find(
      _Category,
      condition,
      options
    );
    if (!getSubcategoryByCategories) throw new Error("SubCategories Not Found");

    _.res(res, getSubcategoryByCategories, 200);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const condition = {
      _id: req.body.subcategory,
      dean: req.body.category,
    };
    const options = [
      {
        populate: {
          path: "dean",
          select: "name image banner",
        },
      },
      {
        populate: {
          path: "hasForm",
        },
      },
    ];
    const category = await Model._findOne(_Category, condition, options);
    if (!category) throw new Error("subCategory Not Found");

    _.res(res, category, 200);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};
