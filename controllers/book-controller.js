const Book = require("../models/book");

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({});
    if (allBooks.length > 0) {
      res.status(200).json({
        success: true,
        message: "List of Books",
        data: allBooks,
      });
    } else {
      res.status(404).json({
        success: false,
        data: "No Books Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! please try again later",
    });
  }
};

const getSingleBookById = async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id);
    if (!bookById) {
      return res.status(404).json({
        success: false,
        message: "Book with current id is not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: bookById,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! please try again later",
    });
  }
};

const addNewBook = async (req, res) => {
  try {
    const newBookFormDate = req.body;
    const newlyCreatedBook = await Book.create(newBookFormDate);
    if (newBookFormDate) {
      res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: newlyCreatedBook,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! please try again later",
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBookFormData = req.body;
    const getCurrentBookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(
      getCurrentBookId,
      updatedBookFormData,
      {
        new: true,
      }
    );
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book Id not found with this id",
      });
    }
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! please try again later",
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(getCurrentBookId);
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book Id not found with this id",
      });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! please try again later",
    });
  }
};

module.exports = {
  getAllBooks,
  getSingleBookById,
  addNewBook,
  updateBook,
  deleteBook,
};
