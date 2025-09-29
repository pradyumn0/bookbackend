import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv/config";

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;

    app.on("error", (err) => {
      console.log("ERR:", err);
      throw err;
    });
    app.listen(port, () => {
      console.log(`Server is running at port :${port}`);
    });
  })
  .catch((err) => {
    console.log("MOngoDB Connection failed !!!", err);
  });
