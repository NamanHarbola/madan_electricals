// madan-store-backend/controllers/analyticsController.js
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

const credentialsPath = path.join(process.cwd(), 'google-credentials.json');

const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: credentialsPath,
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

// --- NEW: Function to get page views for different date ranges ---
const getViewStats = async (req, res) => {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        return res.status(500).json({ message: 'Google Analytics Property ID is not configured.' });
    }

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today', name: 'today' },
                { startDate: 'yesterday', endDate: 'yesterday', name: 'yesterday' },
                { startDate: '7daysAgo', endDate: 'today', name: '7days' },
                { startDate: '2020-01-01', endDate: 'today', name: 'total' },
            ],
            metrics: [
                { name: 'screenPageViews' }
            ],
        });

        const viewStats = response.dateRanges.reduce((acc, dateRange) => {
            const row = response.rows.find(r => r.dimensionValues[0].value === dateRange.name);
            acc[dateRange.name] = row ? row.metricValues[0].value : '0';
            return acc;
        }, {});

        res.json(viewStats);

    } catch (error) {
        console.error('Error fetching view stats from Google Analytics:', error);
        res.status(500).json({ message: 'Failed to fetch view stats.' });
    }
};


module.exports = { getLiveUsers, getViewStats };