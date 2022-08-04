import express from 'express';
import PhotoController from './photo.controller.js';
import ReviewController from './reviews.controller.js';
import PortfolioController from './portfolio.controller.js';

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
export default router;