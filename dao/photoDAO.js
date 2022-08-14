import mongodb, { ObjectId } from "mongodb";
import AWS from 'aws-sdk';
import fs from "fs";
import { resolve } from "path";
import { rejects } from "assert";
import dotenv from "dotenv";
import { s3 } from '../api/upload.controller.js';
const objectId = mongodb.ObjectId;

// dotenv.config();
// const allowedTypes = ['jpg', 'png', 'jpeg'];
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_S3_KEY_ID,
//     secretAccessKey: process.env.AWS_S3_KEY,
//     region: process.env.AWS_REGION
// }, allowedTypes);

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

    static async getPhotoById(photo_id) {
        try {
            return await photos.aggregate([{
                    $match: {
                        _id: new ObjectId(photo_id),
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

    static async addPhoto(user_name, user_id, photo_name = "", filePath, AWSKey, date) {
        try {
            const photo = {
                user_name: user_name,
                user_id: user_id,
                photo_name: photo_name,
                AWSKey: AWSKey,
                img: filePath,
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

    static async deletePhoto(photo_id, user_id) {
        try {

            const photo = await photos.findOne({ _id: ObjectId(photo_id) });

            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: photo.AWSKey
            };
            s3.deleteObject(params, function(err, data) {
                if (err) console.log(err, err.stack); // error
                else console.log(); // deleted
            });

            const deleteResponse = await photos.deleteOne({
                _id: ObjectId(photo_id),
                user_id: user_id,
            });

            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete photo: ${e}`);
            return { error: e };
        }
    }

    static async updatePhotoLike(photo_id, like) {
        try {
            const updateResponse = await photos.updateOne({ _id: ObjectId(photo_id) }, { $set: { like: like } }, { upsert: true })
            return updateResponse;
        } catch (e) {
            console.log(`Unable to update portfolio: ${e}`);
            return { error: e };
        }
    }
}