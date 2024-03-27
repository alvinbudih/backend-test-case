import { NextFunction, Request, Response } from "express";
import Book from "../services/book";

export default class BookController {
  static async getBooks(req: Request, res: Response, next: NextFunction) {
    console.log("list book api");

    try {
      const [quantity, books] = await Promise.all([
        Book.sumBook(),
        Book.getAll(),
      ]);

      res.json({ quantity, books });
    } catch (error) {
      next(error);
    }
  }

  static async getBook(req: Request, res: Response, next: NextFunction) {
    console.log("get one book api...");

    try {
      const {
        params: { id },
      } = req;

      const book = await Book.getOne(id);

      res.json(book);
    } catch (error) {
      next(error);
    }
  }
}
