import express from 'express';
import PhotoController from './photo.controller.js';
import ReviewController from './reviews.controller.js';
import PortfolioController from './portfolio.controller.js';
import upload from './upload.controller.js';


const router = express.Router();

router.route("/")
    .get(PhotoController.apiGetPhoto)
    .put(PhotoController.apiUpdatePhotoLike);


router.route("/photo/:id").get(PhotoController.apiGetPhotoById);

router.route("/review")
    .post(ReviewController.apiPostReview)
    .put(ReviewController.apiUpdateReview)
    .delete(ReviewController.apiDeleteReview);

router.route("/portfolio/:userId")
    .post(upload.single('photo'), PhotoController.apiPostPhoto)
    .delete(PhotoController.apiDeletePhoto)
    .get(PortfolioController.apiGetPortfolio)
    .put(PortfolioController.apiUpdatePortfolio);

router.route('/upload')
    .post(upload.single('photo'), function(req, res, next) {
        console.log('Uploaded!');
        console.log(req);
    });

export default router;