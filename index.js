import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import PhotoDAO from './dao/photoDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';
import PortfolioDAO from './dao/portfolioDAO.js';

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(
        process.env.PHOTO_DB_URI
    )
    const port = process.env.PORT || 8000;

    try {
        await client.connect();
        await PhotoDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);
        await PortfolioDAO.injectDB(client);

        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);