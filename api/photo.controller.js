import PhotoDAO from "../dao/photoDAO.js";

export default class PhotoController {

    static async apiGetPhoto(req, res, next) {
        try {
            const newest = req.body.newest;
            const oldest = req.body.oldest;
            const photoList = await PhotoDAO.getPhoto(newest, oldest);
            res.json(photoList);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetPhotoById(req, res, next) {
        try {
            let photo_id = req.params.id || req.body.photo_id || {}
            let photo = await PhotoDAO.getPhotoById(photo_id);
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

    static async apiPostPhoto(req, res, next) {
        try {
            const name = req.body.user_name;
            const id = req.body.user_id;
            const photo_name = req.body.photo_name;
            const AWSKey = req.file.key;
            const filePath = req.file.location;
            const date = new Date();
            const photoId = await PhotoDAO.addPhoto(
                name,
                id,
                photo_name,
                filePath,
                AWSKey,
                date
            );
            var { error } = photoId;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to post photo." });
            } else {
                res.json(photoId);
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeletePhoto(req, res, next) {
        try {
            const photo_id = req.body.photo_id;
            const user_id = req.body.user_id;
            const photoResponse = await PhotoDAO.deletePhoto(
                photo_id,
                user_id
            );
            var { error } = photoResponse;
            console.log(error);
            if (error) {
                res.status(500).json({ error: "Unable to delete review." });
            } else {
                res.json({ status: "success" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdatePhotoLike(req, res, next) {
        try {
            const response = await PhotoDAO.updatePhotoLike(
                req.body.photo_id,
                req.body.like
            )
            var { error } = response;
            if (error) {
                res.status(500).json({ error });
            }
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetPhotosByIds(req, res, next) {
        try {
            let ids = req.query["ids"] || {}
            
            console.log(ids);

            let photosList = await PhotoDAO.getAllPhotosByIds(ids);

            if(!photosList) {
                res.status(404).json({error: "Not found"});
                return;
            }
            res.json(photosList);
        }catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e});
        }
    }
}