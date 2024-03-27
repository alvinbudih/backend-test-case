import express from "express";
import MemberController from "../controllers/member-controller";
const members = express.Router();

members.get("/", MemberController.getMembers);

members.get("/:id", MemberController.getMember);

members.patch("/:id/borrow/:bookId", MemberController.borrowBook);

members.patch("/:id/return/:bookId", MemberController.returnBook);

export default members;
