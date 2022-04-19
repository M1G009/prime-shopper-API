const Categories = require("./../../models/schemas/DynamicCategoriesSchema");
var slugify = require("slugify");

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

exports.getCategory = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error("Please enter id");
    }

    let category = await Categories.findById(req.params.id);

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

exports.addCategory = async (req, res) => {
  try {
    if (!req.body || !req.body) {
      throw new Error("Please enter correct fields");
    }

    let category = { ...req.body };
    // console.log("category", category);
    if (req.files && req.files.banner && req.files.banner[0]) {
      category.banner = req.files.banner[0].filename;
    }
    category.slug = slugify(category.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      locale: "vi",
      trim: true,
    });

    let parentId = category.parentId;
    let addId = category.id;

    if (parentId) {
      let treeCategory = await Categories.findById(parentId);
      if (category.parentId == category.id) {
        treeCategory.children.push({ data: category });
        await Categories.findByIdAndUpdate(parentId, treeCategory);
      } else {
        function updateTree(id, update, tree) {
          if (tree.id === id) {
            tree.children.push(update);
          } else {
            tree.children = tree.children.map(function (item) {
              return updateTree(id, update, item);
            });
          }
          return tree;
        }
        let updatedCategory = updateTree(
          addId,
          { data: category },
          treeCategory
        );

        await Categories.findByIdAndUpdate(parentId, updatedCategory);
      }
    } else {
      await Categories.create({ data: category });
    }

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

exports.updateCategory = async (req, res) => {
  try {
    if (!req.body || !req.body) {
      throw new Error("Please enter correct fields");
    }

    let updateData = { ...req.body };
    if (req.files && req.files.banner && req.files.banner[0]) {
        updateData.banner = req.files.banner[0].filename;
    }
    updateData.slug = slugify(updateData.name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
    });
    
    let parentId = req.body.parentId;
    let updateId = updateData.id;
    console.log("updateData", updateData);

    let treeCategory = await Categories.findById(parentId);

    function updateTree(id, update, tree) {
      if (tree.id === id) {
        tree.data = update;
      } else {
        tree.children = tree.children.map(function (item) {
          return updateTree(id, update, item);
        });
      }
      return tree;
    }

    let updatedCategory = updateTree(updateId, updateData, treeCategory);

    await Categories.findByIdAndUpdate(parentId, updatedCategory);
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

exports.deleteCategory = async (req, res) => {
  try {
    if (!req.body || !req.body) {
      throw new Error("Please enter correct fields");
    }

    let parentId = req.body.parentId;
    let deleteId = req.body.deleteId;

    if (parentId === deleteId) {
      await Categories.findByIdAndDelete(parentId);
    } else {
      let treeCategory = await Categories.findById(parentId);

      function deleteObject(deleteId, parent) {
        parent.children = parent.children
          .filter(function (child) {
            return child.id !== deleteId;
          })
          .map(function (child) {
            return deleteObject(deleteId, child);
          });
        return parent;
      }

      let updatedCategory = deleteObject(deleteId, treeCategory);

      await Categories.findByIdAndUpdate(parentId, updatedCategory);
    }

    let data = await Categories.find();

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
