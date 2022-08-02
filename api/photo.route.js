import express from 'express';
import PhotoController from './photo.controller.js';
import ReviewController from './reviews.controller.js';
import PortfolioController from './portfolio.controller.js';

const router = express.Router();

router.route("/").get(PhotoController.apiGetPhoto);
router.route("/").post(PhotoController.apiPostPhoto);
router.route("/").delete(PhotoController.apiDeletePhoto);
router.route("/id/:id").get(PhotoController.apiGetPhotoById);

router.route("/review").post(ReviewController.apiPostReview);
router.route("/review").put(ReviewController.apiUpdateReview);
router.route("/review").delete(ReviewController.apiDeleteReview);

router
    .route("/portfolio")
    .put(PortfolioController.apiUpdatePortfolio);

router
    .route("/portfolio/:userId")
    .get(PortfolioController.apiGetPortfolio);
export default router;