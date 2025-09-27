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

// --- CORRECTED: Function to get page views for different date ranges ---
const getViewStats = async (req, res) => {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        return res.status(500).json({ message: 'Google Analytics Property ID is not configured.' });
    }

    try {
        // Define the date ranges for the report
        const dateRanges = [
            { startDate: 'today', endDate: 'today', name: 'today' },
            { startDate: 'yesterday', endDate: 'yesterday', name: 'yesterday' },
            { startDate: '7daysAgo', endDate: 'today', name: '7days' },
            { startDate: '2020-01-01', endDate: 'today', name: 'total' },
        ];

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: dateRanges,
            metrics: [{ name: 'screenPageViews' }],
        });

        // Correctly map the results to the date ranges by their index
        const viewStats = {};
        dateRanges.forEach((range, index) => {
            // Check if a corresponding row exists for this date range index
            const row = response.rows[index];
            viewStats[range.name] = row ? row.metricValues[0].value : '0';
        });

        res.json(viewStats);

    } catch (error) {
        console.error('Error fetching view stats from Google Analytics:', error);
        res.status(500).json({ message: 'Failed to fetch view stats.' });
    }
};


module.exports = { getLiveUsers, getViewStats };