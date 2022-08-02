let myPortfolio;

export default class PortfolioDAO {

    static async injectDB(conn) {
        if (myPortfolio) {
            return;
        }
        try {
            myPortfolio = await conn.db(process.env.PHOTOREVIEWS_NS)
                .collection('portfolio');
        } catch (e) {
            console.error(`Unable to connect in portfolioDAO: ${e}`);
        }
    }

    static async updateportfolio(userId, portfolio) {
        try {
            const updateResponse = await myPortfolio.updateOne({ _id: userId }, { $set: { portfolio: portfolio } }, { upsert: true })
            return updateResponse;
        } catch (e) {
            console.log(`Unable to update portfolio: ${e}`);
            return { error: e };
        }
    }

    static async getPortfolio(id) {
        let cursor;
        try {
            cursor = await myPortfolio.find({
                _id: id
            });
            const portfolio = await cursor.toArray();
            return portfolio[0];
        } catch (e) {
            console.error(`Something went wrong in getFavorties: ${e}`);
            throw e;
        }
    }
}