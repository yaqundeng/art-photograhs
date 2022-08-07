import express from 'express';
import PhotoController from './photo.controller.js';
import ReviewController from './reviews.controller.js';
import PortfolioController from './portfolio.controller.js';

import upload from './aws-s3.js';

const router = express.Router();

router.route("/").get(PhotoController.apiGetPhoto);
router.route("/id/:id").get(PhotoController.apiGetPhotoById);

router.route("/review")
    .post(ReviewController.apiPostReview)
    .put(ReviewController.apiUpdateReview)
    .delete(ReviewController.apiDeleteReview);

router
    .route("/portfolio/:userId")
    .post(PhotoController.apiPostPhoto)
    .delete(PhotoController.apiDeletePhoto)
    .get(PortfolioController.apiGetPortfolio)
    .put(PortfolioController.apiUpdatePortfolio);

router.
route("/upload").post(function(req, res) {
    upload(req.body.path, req.body.user_id);
})

export default router;