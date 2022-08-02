import PhotoDAO from "../dao/photoDAO.js";

export default class PhotoController {

    static async apiGetPhoto(req, res, next) {
        const photoPerPage = req.query.photoPerPage ?
            parseInt(req.query.photoPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }

        const { photoList, totalNumphoto } = await PhotoDAO.getphoto({ filters, page, photoPerPage });

        let response = {
            photo: photoList,
            page: page,
            filters: filters,
            entries_per_page: photoPerPage,
            total_results: totalNumphoto,
        };
        res.json(response);
    }

    static async apiGetPhotoById(req, res, next) {
        try {
            let id = req.params.id || {}
            let photo = await PhotoDAO.getphotoById(id);
            if (!photo) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(photo);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiPostPhoto(req, res, next) {}

    static async apiDeletePhoto(req, res, next) {}

}