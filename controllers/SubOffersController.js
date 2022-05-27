const newArrivalSubPageSlider = require("../models/sub/newArrivalSubPage");
const bestSeller1 = require("../models/sub/bestSeller1");
const bestSeller2 = require("../models/sub/bestSeller2");


exports.getAllSubSliders = async (req, res) => {
  try {
    let allSubSlidersData = {};
    const newArrivalOffersData = await newArrivalSubPageSlider.find();
    if (newArrivalOffersData && newArrivalOffersData.length) {
      allSubSlidersData["newArrivalOffersData"] = newArrivalOffersData;
    }

    const bestSeller1Data = await bestSeller1.find();
    if (bestSeller1Data && bestSeller1Data.length) {
      allSubSlidersData["bestSeller1Data"] = bestSeller1Data;
    }

    const bestSeller2Data = await bestSeller2.find();
    if (bestSeller2Data && bestSeller2Data.length) {
      allSubSlidersData["bestSeller2Data"] = bestSeller2Data;
    }

    res.status(200).json({
      status: "success",
      data: allSubSlidersData,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updatenewArrivalSubPageSlider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const newArrivalSubPageSliderData = await newArrivalSubPageSlider.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: newArrivalSubPageSliderData,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const newArrivalSubPageSliderData = await newArrivalSubPageSlider.create(updatedata);
      res.status(200).json({
        status: "success",
        data: newArrivalSubPageSliderData,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateSubBestSeller1Slider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const bestSeller1Data = await bestSeller1.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: bestSeller1Data,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const bestSeller1Data = await bestSeller1.create(updatedata);
      res.status(200).json({
        status: "success",
        data: bestSeller1Data,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateSubBestSeller2Slider = async (req, res) => {
  try {
    if (req.body.id) {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const bestSeller2Data = await bestSeller2.findByIdAndUpdate(
        req.body.id,
        updatedata
      );
      res.status(200).json({
        status: "success",
        data: bestSeller2Data,
      });
    } else {
      let updatedata = {};
      if (req.body.redirectLink) {
        updatedata["redirectLink"] = req.body.redirectLink;
      }
      if (req.file) {
        updatedata["image"] = req.file.filename;
      }
      const bestSeller2Data = await bestSeller2.create(updatedata);
      res.status(200).json({
        status: "success",
        data: bestSeller2Data,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deletenewArrivalSubPageSlider = async (req, res) => {
  try {
    if (!req.body.id) {
      throw new Error("Please provide valid Id");
    }
    const newArrivalSubPageSliderData = await newArrivalSubPageSlider.findByIdAndDelete(
      req.body.id
    );
    res.status(200).json({
      status: "success",
      data: newArrivalSubPageSliderData,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteSubBestSeller1Slider = async (req, res) => {
  try {
    if (!req.body.id) {
      throw new Error("Please provide valid Id");
    }
    const bestSeller1Data = await bestSeller1.findByIdAndDelete(
      req.body.id
    );
    res.status(200).json({
      status: "success",
      data: bestSeller1Data,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteSubBestSeller2Slider = async (req, res) => {
  try {
    if (!req.body.id) {
      throw new Error("Please provide valid Id");
    }
    const bestSeller2Data = await bestSeller2.findByIdAndDelete(
      req.body.id
    );
    res.status(200).json({
      status: "success",
      data: bestSeller2Data,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};