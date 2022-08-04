let myPortfolios;

export default class PortfolioDAO {

    static async injectDB(conn) {
        if (myPortfolios) {
            return;
        }
        try {
            myPortfolios = await conn.db(process.env.PHOTO_NS).collection('myportfolio');
        } catch (e) {
            console.error(`Unable to connect in portfolioDAO: ${e}`);
        }
    }

    static async updatePortfolio(user_id, portfolio) {
        try {
            const updateResponse = await myPortfolios.updateOne({ _id: user_id }, { $set: { portfolio: portfolio } }, { upsert: true })
            return updateResponse;
        } catch (e) {
            console.log(`Unable to update portfolio: ${e}`);
            return { error: e };
        }
    }

    static async getPortfolio(user_id) {

        let cursor;
        try {
            cursor = await myPortfolios.find({
                _id: user_id
            });
            const portfolio = await cursor.toArray();
            return portfolio[0].portfolio;
        } catch (e) {
            console.error(`Something went wrong in getFavorties: ${e}`);
            throw e;
        }
    }
}