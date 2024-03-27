import { NextFunction, Request, Response } from "express";
import Member from "../services/member";

export default class MemberController {
  static async getMembers(req: Request, res: Response, next: NextFunction) {
    console.log("list member api...");

    try {
      const members = await Member.getAll();

      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  static async getMember(req: Request, res: Response, next: NextFunction) {
    console.log("get member api...");

    try {
      const {
        params: { id },
      } = req;

      const member = await Member.getOne(id);

      res.json(member);
    } catch (error) {
      next(error);
    }
  }

  static async borrowBook(req: Request, res: Response, next: NextFunction) {
    console.log("borrow book api...");

    try {
      const {
        params: { id, bookId },
      } = req;

      const book = await Member.borrowBook(id, bookId);

      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }

  static async returnBook(req: Request, res: Response, next: NextFunction) {
    console.log("return book api...");

    try {
      const {
        params: { id, bookId },
      } = req;

      const { result, isPenalty } = await Member.returnBook(id, bookId);

      res.json({ book: result, isPenalty });
    } catch (error) {
      next(error);
    }
  }
}
