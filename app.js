import express from "express";

import dotenv from "dotenv/config";

const app = express();

app.use(express.json({ limit: "16kb" }));
// app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// import routes
import bookRoute from "./routes/book.route.js";

// rontes declaration
app.use("/api/books", bookRoute);


export { app };
