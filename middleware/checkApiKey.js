require('dotenv').config();

const checkApiKey = (req, res, next) => {
    try {
        const clientApiKey = req.headers['api-key']

        if(!clientApiKey){
            return res.status(403).json({
                message : "API Key Missing"
            })
        }

        if(clientApiKey !== process.env.API_KEY){
            return res.status(403).json({ 
                message: "Invalid API Key" 
            });
        }
        next();
    } catch (e) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { checkApiKey }