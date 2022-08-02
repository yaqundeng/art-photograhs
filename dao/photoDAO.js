import mongodb, { ObjectId } from "mongodb";
const objectId = mongodb.ObjectId;

let photo;

export default class PhotoDAO {
    static async injectDB(conn) {
        if (photo) {
            return;
        }
        try {
            photo = await conn.db(process.env.PHOTOREVIEWS_NS).collection('photo');
        } catch (e) {
            console.error(`Unable to connect in PhotoDao: ${e}`);
        }
    }

    static async getPhoto({
        filters = null,
        page = 0,
        photoPerPage = 20,
    } = {}) {
        let query;
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } };
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }

        let cursor;
        try {
            cursor = await photo.find(query)
                .limit(photoPerPage)
                .skip(photoPerPage * page);
            const photoList = await cursor.toArray();
            const totalNumPhoto = await photo.countDocuments(query);
            return { photoList, totalNumPhoto };
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { photoList: [], totalNumPhoto: 0 };
        }
    }

    static async getPhotoById(id) {
        try {
            return await photo.aggregate([{
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'photo_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        } catch (e) {
            console.error(`Something went wrong in getPhotoById: ${e}`);
            throw e;
        }
    }

    static async addPhoto(id) {}

    static async deletePhoto(id) {}
}