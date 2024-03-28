import express from "express";
import cors from "cors";
import books from "./routes/books";
import errorHandler from "./middlewares/errorHandler";
import members from "./routes/members";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", books);
app.use("/members", members);

app.use(errorHandler);

export default app;
