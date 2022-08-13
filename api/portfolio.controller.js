import PortfolioDAO from '../dao/portfolioDAO.js';

export default class PortfolioController {
    static async apiUpdatePortfolio(req, res, next) {
        try {
            const user_id = req.params.userId || req.body.user_id;
            const portfolioResponse = await PortfolioDAO.updatePortfolio(
                user_id,
                req.body.portfolio
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
            const user_id = req.params.userId || req.body.user_id;
            let portfolio = await PortfolioDAO.getPortfolio(user_id);
            if (!portfolio) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(portfolio);
        } catch (e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}