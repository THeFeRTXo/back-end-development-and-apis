import express from "express";
import apiRouter from "./routes/api.routes.js"
import {notFoundHandler, finalErrorHandler} from "./middleware/error.middleware.js"

const app = express();

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(finalErrorHandler);

app.listen(3000, () => {
    console.log("http://localhost:3000");
})
