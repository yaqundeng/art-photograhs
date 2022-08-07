import mongodb, { ObjectId } from "mongodb";
import AWS from 'aws-sdk';
import fs from "fs";
import { resolve } from "path";
import { rejects } from "assert";
const objectId = mongodb.ObjectId;

const s3 = new AWS.S3({
    // accessKeyId: process.env.AWS_S3_KEY_ID,
    // secretAccessKey: process.env.AWS_S3_KEY
    accessKeyId: "AKIAQ4UURO45EE4ZEOHH",
    secretAccessKey: "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"
});

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

    static async addPhoto(user_name, user_id, photo_name = "", filePath, date) {
        const AWSKey = user_id + " - " + date.toString() + ".png";
        const uploadFile = (filePath) => {
            return new Promise((resolve, reject) => {
                const fileContent = fs.createReadStream(filePath);
                const params = {
                    Bucket: "myphotowebsitehw",
                    Key: AWSKey, // File name you want to save as in S3
                    ContentType: 'image/png',
                    Body: fileContent
                };
                s3.upload(params, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    resolve(data.Location);
                    console.log(`File uploaded successfully. ${data.Location}`);
                });
            })
        }
        const img = await uploadFile(filePath);
        try {
            const photo = {
                user_name: user_name,
                user_id: user_id,
                photo_name: photo_name,
                AWSKey: AWSKey,
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
            const photo = await photos.findOne({ _id: ObjectId(photoID) });;
            var params = {
                Bucket: "myphotowebsitehw",
                Key: photo.AWSKey
            };
            s3.deleteObject(params, function(err, data) {
                if (err) console.log(err, err.stack); // error
                else console.log(); // deleted
            });

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