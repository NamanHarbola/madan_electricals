// madan-store-backend/controllers/analyticsController.js
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: 'config/google-credentials.json',
});

const getLiveUsers = async (req, res) => {
    const propertyId = process.env.GA_PROPERTY_ID;

    if (!propertyId) {
        return res.status(500).json({ message: 'Google Analytics Property ID is not configured.' });
    }

    try {
        const [response] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: 'activeUsers' }],
        });

        const liveUsers = response.rows[0]?.metricValues[0]?.value || '0';
        res.json({ liveUsers });
    } catch (error) {
        console.error('Error fetching live users from Google Analytics:', error);
        res.status(500).json({ message: 'Failed to fetch live users from Google Analytics.' });
    }
};

module.exports = { getLiveUsers };