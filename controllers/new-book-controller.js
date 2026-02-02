const Author = require("../models/author");
const Book = require("../models/newBook");

const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);

    await author.save();

    res.status(201).json({
      success: true,
      data: author,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error occurred!",
    });
  }
};

const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);

    await book.save();

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error occurred!",
    });
  }
};

const getBookWithAuthor = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error occurred!",
    });
  }
};

module.exports = { createAuthor, createBook, getBookWithAuthor };
