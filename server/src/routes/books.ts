import express from "express";
import BookController from "../controllers/book-controller";
const books = express.Router();

books.get("/", BookController.getBooks);

books.get("/:id", BookController.getBook);

export default books;
