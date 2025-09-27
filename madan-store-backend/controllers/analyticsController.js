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
            dimensions: [{ name: 'dateRange' }], // Add this dimension
            metrics: [{ name: 'screenPageViews' }],
        });

        const viewStats = {
            today: '0',
            yesterday: '0',
            '7days': '0',
            total: '0'
        };

        if (response && Array.isArray(response.rows)) {
            response.rows.forEach(row => {
                // The dimension value will be 'date_range_0', 'date_range_1', etc.
                const dateRangeIndex = parseInt(row.dimensionValues[0].value.split('_')[2]);
                const rangeName = dateRanges[dateRangeIndex].name;
                const viewCount = row.metricValues[0].value;
                viewStats[rangeName] = viewCount;
            });
        }

        res.json(viewStats);

    } catch (error) {
        console.error('Error fetching view stats from Google Analytics:', error);
        res.status(500).json({ message: 'Failed to fetch view stats.' });
    }
};


module.exports = { getLiveUsers, getViewStats };