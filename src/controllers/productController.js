const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

module.exports = {
  // thêm 1 sản phẩm
  createProduct: asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      let newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),

  //   lấy ra 1 sản phẩm
  getAProduct: asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),

  //   lấy ra tất cả sản phẩm
  getAllProduct: asyncHandler(async (req, res) => {
    try {
      const allProduct = await Product.find();
      res.json(allProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),

  //  sửa 1 sản phẩm
  updateProduct: asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),

  // xóa 1 sản phẩm
  deleteProduct: asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const deleteProduct = await Product.deleteOne({ _id: id });
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
};
