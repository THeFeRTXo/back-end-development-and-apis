import express from "express";
import  { authenticate } from "../middleware/authenticate.js";
import { authorizeRole }  from "../middleware/authorize.js"
import { addMovie, deleteMovie, findById, getWatchlist, updateMovie } from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
    const { userId } = req.params;
    const watchlist = getWatchlist(userId) ?? [];
    res.status(200).json({ watchlist });
})

router.post(
  "/:userId/movies",
  authorizeRole("parent", "child"),
  (req, res, next) => {
    if (req.user.role === "child" && String(req.user.id) !== String(req.params.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  },
  (req, res) => {
    const { userId } = req.params;
    const created = addMovie(userId, req.body);   // ← req.body, no req.body.movie
    res.status(201).json({ message: "Accepted", movie: created });
  }
);

router.put("/:userId/movies/:movieId", authorizeRole("parent", "child"), 
(req, res, next) => {
    if(req.user.role === "child" && String(req.user.id) !== String(req.params.userId)){
        return res.status(403).json({ error: "Forbidden" });
    }
    if(req.user.role === "child" && String(req.user.id) === String(req.params.userId)){
        const userId = Number(req.params.userId);
        const movieId = Number(req.params.movieId); // ✅
        const { updates } = req.body;
        return res.status(200).json({ message: "Accepted", update: updateMovie(userId, movieId, updates)});
    }
    next();
},
(req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);  // ✅
    const { updates } = req.body;
    return res.status(200).json({ message: "Accepted", update: updateMovie(userId, movieId, updates)});
});

router.delete("/:userId/movies/:movieId", authorizeRole("parent", "child"), 
(req, res, next) => {
    if(req.user.role === "child" && String(req.user.id) !== String(req.params.userId)){
        return res.status(403).json({ error: "Forbidden" });
    }
    if(req.user.role === "child" && String(req.user.id) === String(req.params.userId)){
        const userId = Number(req.params.userId);
        const movieId = Number(req.params.movieId);  // ✅
        return res.status(200).json({ message: "Accepted", delete: deleteMovie(userId, movieId)});
    }
    next();
},
(req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);  // ✅
    return res.status(200).json({ message: "Accepted", delete: deleteMovie(userId, movieId)});
})

export default router;


    
