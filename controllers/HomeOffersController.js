const welcomeOffers = require("../models/home/welcomeOffers");
const bigOfferSlider = require("../models/home/bigOfferSlider");
const topSelectedBrandSlider = require("../models/home/topSelectedBrandSlider");
const bestSellerSlider = require("../models/home/bestSellerSlider");
const bestSellingProductSlider = require("../models/home/bestSellingProductSlider");
const newArrivalSlider = require("../models/home/newArrivalSlider");

exports.getAllSliders = async (req, res) => {
  try {
    let allSlidersData = {};
    const welcomeOffersData = await welcomeOffers.find();
    if (welcomeOffersData && welcomeOffersData.length) {
      allSlidersData["welcomeOffersData"] = welcomeOffersData;
    }

    const bigOfferSliderData = await bigOfferSlider.find();
    if (bigOfferSliderData && bigOfferSliderData.length) {
      allSlidersData["bigOfferSliderData"] = bigOfferSliderData;
    }

    const topSelectedBrandSliderData = await topSelectedBrandSlider.find();
    if (topSelectedBrandSliderData && topSelectedBrandSliderData.length) {
      allSlidersData["topSelectedBrandSliderData"] = topSelectedBrandSliderData;
    }

    const bestSellerSliderData = await bestSellerSlider.find();
    if (bestSellerSliderData && bestSellerSliderData.length) {
      allSlidersData["bestSellerSliderData"] = bestSellerSliderData;
    }

    const bestSellingProductSliderData = await bestSellingProductSlider.find();
    if (bestSellingProductSliderData && bestSellingProductSliderData.length) {
      allSlidersData["bestSellingProductSliderData"] =
        bestSellingProductSliderData;
    }

    const newArrivalSliderData = await newArrivalSlider.find();
    if (newArrivalSliderData && newArrivalSliderData.length) {
      allSlidersData["newArrivalSliderData"] = newArrivalSliderData;
    }

    res.status(200).json({
      status: "success",
      data: allSlidersData,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateWelcomeOffers = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const welcomeOffersData = await welcomeOffers.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: welcomeOffersData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const welcomeOffersData = await welcomeOffers.create(updatedata);
      res.status(200).json({
        status: "success",
        data: welcomeOffersData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBigOfferSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.body.uptoOff) {
        updatedata["uptoOff"] = req.body.uptoOff;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bigOfferSliderData = await bigOfferSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: bigOfferSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.body.uptoOff) {
        updatedata["uptoOff"] = req.body.uptoOff;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bigOfferSliderData = await bigOfferSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: bigOfferSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateTopSelectedBrandSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const topSelectedBrandSliderData = await topSelectedBrandSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: topSelectedBrandSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const topSelectedBrandSliderData = await topSelectedBrandSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: topSelectedBrandSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBestSellerSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.body.category) {
        updatedata["category"] = req.body.category;
      }
      if (req.body.uptoOff) {
        updatedata["uptoOff"] = req.body.uptoOff;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bestSellerSliderData = await bestSellerSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: bestSellerSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.body.category) {
        updatedata["category"] = req.body.category;
      }
      if (req.body.uptoOff) {
        updatedata["uptoOff"] = req.body.uptoOff;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bestSellerSliderData = await bestSellerSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: bestSellerSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBestSellingProductSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bestSellingProductSliderData = await bestSellingProductSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: bestSellingProductSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const bestSellingProductSliderData = await bestSellingProductSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: bestSellingProductSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateNewArrivalSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const newArrivalSliderData = await newArrivalSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: newArrivalSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.files.image && req.files.image.length) {
        updatedata["image"] = req.files.image[0].filename;
      }
      const newArrivalSliderData = await newArrivalSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: newArrivalSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
