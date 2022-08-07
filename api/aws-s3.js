import AWS from 'aws-sdk';
import fs from "fs";

const s3 = new AWS.S3({
    // accessKeyId: process.env.AWS_S3_KEY_ID,
    // secretAccessKey: process.env.AWS_S3_KEY
    accessKeyId: "AKIAQ4UURO45EE4ZEOHH",
    secretAccessKey: "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"
});

const upload = (filePath, user_id) => {
    // Read content from the file
    const fileContent = fs.createReadStream(filePath);
    const date = new Date();
    // Setting up S3 upload parameters
    const params = {
        // Bucket: process.env.AWS_BUCKET_NAME,
        Bucket: "myphotowebsitehw",
        Key: user_id + date.toString() + ".png", // File name you want to save as in S3
        ContentType: 'image/png',
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

export default upload;