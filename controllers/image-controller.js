const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const Image = require("../models/image");

const uploadImageController = async (req, res) => {
  try {
    // Check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload file.",
      });
    }

    // Upload to Cloudinary
    const { publicId, url } = await uploadToCloudinary(req.file.path);

    // Store image url and public id alogn with user id in DB
    const uploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await uploadedImage.save();

    // Delete the file from local uploads folder after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: uploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const fetchImagesController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const totalImages = await Image.countDocuments();
  const totalPages = Math.ceil(totalImages / limit);

  const sortObj = {};
  sortObj[sortBy] = sortOrder;

  try {
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Check if is image uploaded by current user who is trying to delete
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorize to delte this image",
      });
    }

    // Delete image from cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    // Delete image from db
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({
      success: true,
      data: "Image Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};
