import PortfolioDAO from '../dao/portfolioDAO.js';

export default class PortfolioController {
    static async apiUpdatePortfolio(req, res, next) {
        try {
            console.log(`apiUpdatePortfolio: ${req.body}`);
            const user_id = req.params.userId;
            const portfolioResponse = await PortfolioDAO.updatePortfolio(
                user_id,
                req.body
            )

            var { error } = portfolioResponse;
            if (error) {
                res.status(500).json({ error });
            }
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetPortfolio(req, res, next) {
        try {
            const user_id = req.params.userId;
            let portfolio = await PortfolioDAO.getPortfolio(user_id);
            if (!portfolio) {
                res.json([]);
                return;
            }
            res.json(portfolio);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}