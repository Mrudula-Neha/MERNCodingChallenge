const Transaction = require('../models/Transaction');
const axios = require('axios');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({}); 
        await Transaction.insertMany(response.data); 
        res.status(200).json({ message: 'Database initialized successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initialize database', error });
    }
};


const getTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10 } = req.query;

    try {
        const query = {};

        
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { price: { $regex: search } } 
            ];
        }

      
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(total / perPage),
            currentPage: page
        });
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
};




const getStatistics = async (month, year) => {
  try {
    const statistics = await db.collection('transactions').aggregate([
      {
        $match: {
       
          dateOfSale: {
            $gte: new Date(`${year}-${month}-01T00:00:00Z`),
            $lt: new Date(`${year}-${month + 1}-01T00:00:00Z`) 
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: { $cond: [{ $eq: ['$sold', true] }, '$price', 0] } },
          totalSoldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }
        }
      }
    ]).toArray();

    
    if (statistics.length === 0) {
      return {
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
        message: `No transactions found for ${month}/${year}`
      };
    }

    return {
      totalSaleAmount: statistics[0].totalSaleAmount,
      totalSoldItems: statistics[0].totalSoldItems,
      totalNotSoldItems: statistics[0].totalNotSoldItems
    };

  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return {
      message: "Failed to fetch statistics",
      error: error
    };
  }
};


const getBarChartData = async (req, res) => {
    const { month } = req.query; 
    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
       
        const startDate = new Date(`1 ${month} 2024`); 
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); 

        console.log('Start Date:', startDate); 
        console.log('End Date:', endDate); 

       
        const results = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: startDate,
                        $lt: endDate 
                    }
                }
            },
            {
                // Create price ranges using $bucket
                $bucket: {
                    groupBy: "$price", 
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], 
                    default: "901-above", 
                    output: {
                        count: { $sum: 1 } 
                    }
                }
            }
        ]);

        const formattedData = results.map(item => ({
            range: item._id === "901-above" ? "901-above" : `${item._id - (item._id % 100)}-${item._id - (item._id % 100) + 99}`,
            count: item.count
        }));

        const allRanges = [
            { range: '0-100', count: 0 },
            { range: '101-200', count: 0 },
            { range: '201-300', count: 0 },
            { range: '301-400', count: 0 },
            { range: '401-500', count: 0 },
            { range: '501-600', count: 0 },
            { range: '601-700', count: 0 },
            { range: '701-800', count: 0 },
            { range: '801-900', count: 0 },
            { range: '901-above', count: 0 }
        ];

       
        formattedData.forEach(result => {
            const rangeIndex = allRanges.findIndex(r => r.range === result.range);
            if (rangeIndex !== -1) {
                allRanges[rangeIndex].count = result.count; 
            }
        });

        res.status(200).json(allRanges); 
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ message: 'Failed to fetch bar chart data', error });
    }
};


const getPieChartData = async (req, res) => {
    const { month } = req.query; 

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    const monthNumbers = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };

    const currentYear = 2021; 

    const startDate = new Date(currentYear, monthNumbers[month], 1); 
    const endDate = new Date(currentYear, monthNumbers[month] + 1, 0, 23, 59, 59, 999); 

    console.log('Start Date:', startDate); 
    console.log('End Date:', endDate); 

    try {
        const data = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } }, 
            { $group: { _id: "$category", total: { $sum: "$price" } } } 
        ]);

        const formattedData = data.map(item => ({
            category: item._id,
            total: item.total
        }));

        res.status(200).json(formattedData); 
    } catch (error) {
        console.error('Error fetching bar chart data:', error); 
        res.status(500).json({ message: 'Failed to fetch bar chart data', error });
    }
};


module.exports = {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getPieChartData,
    getBarChartData 
};
