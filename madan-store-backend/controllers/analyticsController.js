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

// --- FINAL CORRECTED VERSION ---
const getViewStats = async (req, res) => {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        return res.status(500).json({ message: 'Google Analytics Property ID is not configured.' });
    }

    try {
        const dateRanges = [
            { name: 'today', startDate: 'today', endDate: 'today' },
            { name: 'yesterday', startDate: 'yesterday', endDate: 'yesterday' },
            { name: '7days', startDate: '7daysAgo', endDate: 'today' },
            { name: 'total', startDate: '2020-01-01', endDate: 'today' },
        ];

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: dateRanges,
            metrics: [{ name: 'screenPageViews' }],
        });

        const viewStats = {};
        
        // The API returns rows that correspond to dateRanges by index.
        // We must handle cases where there might be no rows.
        if (response && Array.isArray(response.rows)) {
            dateRanges.forEach((range, index) => {
                const row = response.rows[index];
                viewStats[range.name] = row && row.metricValues[0] ? row.metricValues[0].value : '0';
            });
        } else {
            // If no rows are returned, default all stats to '0'
            dateRanges.forEach(range => {
                viewStats[range.name] = '0';
            });
        }

        res.json(viewStats);

    } catch (error) {
        console.error('Error fetching view stats from Google Analytics:', error);
        res.status(500).json({ message: 'Failed to fetch view stats.' });
    }
};


module.exports = { getLiveUsers, getViewStats };