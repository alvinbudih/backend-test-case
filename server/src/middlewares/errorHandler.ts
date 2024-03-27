import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number;
  let message: string;

  console.log(error);

  switch (true) {
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
