import mongodb, { ObjectId } from "mongodb";
const objectId = mongodb.ObjectId;

let photos;

export default class PhotoDAO {
    static async injectDB(conn) {
        if (photos) {
            return;
        }
        try {
            photos = await conn.db(process.env.PHOTO_NS).collection('photo');
        } catch (e) {
            console.error(`Unable to connect in PhotoDao: ${e}`);
        }
    }

    static async getPhoto(newest = false, oldest = false) {
        try {
            const allphoto = await photos.find().toArray();
            let photoList = allphoto.sort((a, b) => a.like.length > b.like.length ? -1 : 1);
            if (newest) {
                photoList = allphoto.sort((a, b) => b.date - a.date);
            } else if (oldest) {
                photoList = allphoto.sort((a, b) => a.date - b.date);
            }
            return photoList;
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { photoList: [], totalNumPhoto: 0 };
        }
    }

    static async getPhotoById(id) {
        try {
            return await photos.aggregate([{
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

    static async addPhoto(user_name, user_id, img, date) {
        try {
            const photo = {
                user_name: user_name,
                user_id: user_id,
                img: img,
                date: date,
                like: [],
            }
            const info = await photos.insertOne(photo);
            return info.insertedId;
        } catch (e) {
            console.error(`Unable to post photo: ${e}`);
            return { error: e };
        }
    }

    static async deletePhoto(photoID, userId) {
        try {
            const deleteResponse = await photos.deleteOne({
                _id: ObjectId(photoID),
                user_id: userId,
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete photo: ${e}`);
            return { error: e };
        }
    }
}