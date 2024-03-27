import express from "express";
import cors from "cors";
import books from "./routes/books";
import errorHandler from "./middlewares/errorHandler";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", books);

app.use(errorHandler);

app.listen(port, () => {
  console.clear();
  console.log(`Example app listening on port ${port}`);
});
