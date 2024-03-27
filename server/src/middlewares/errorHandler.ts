import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/errors/CustomError";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number;
  let message: string;

  switch (true) {
    case error instanceof CustomError:
      status = error.status;
      message = error.message;
      break;

    case error instanceof PrismaClientKnownRequestError:
      status = 404;
      message = error.message;
      break;

    default:
      status = 500;
      message = error.message;
      break;
  }

  res.status(status).json({ message });
}
