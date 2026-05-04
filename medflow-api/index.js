const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const salesRoutes = require('./routes/sales');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', salesRoutes);

// Dashboard/Alerts Aggregation Route
const auth = require('./middleware/auth');
const Medicine = require('./models/Medicine');
const Sale = require('./models/Sale');

app.get('/api/dashboard', auth, async (req, res) => {
  try {
    // Basic aggregation
    const medicines = await Medicine.find();
    const sales = await Sale.find();

    const totalMedicines = medicines.length;
    const totalSalesValue = sales.reduce((acc, sale) => acc + sale.total, 0);
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const lowStock = medicines.filter(m => m.quantity < 10);
    const expiringSoon = medicines.filter(m => new Date(m.expiryDate) < thirtyDaysFromNow);

    // Sales by Date (for chart)
    const salesByDateMap = {};
    sales.forEach(sale => {
      const dateString = sale.createdAt.toISOString().split('T')[0];
      salesByDateMap[dateString] = (salesByDateMap[dateString] || 0) + sale.total;
    });
    const salesChartData = Object.keys(salesByDateMap).map(date => ({
      date,
      amount: salesByDateMap[date]
    })).slice(-7); // last 7 days

    // Category Distribution (for pie chart)
    const categoryMap = {};
    medicines.forEach(med => {
      categoryMap[med.category] = (categoryMap[med.category] || 0) + med.quantity;
    });
    const categoryChartData = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));

    res.json({
      totalSalesValue,
      totalMedicines,
      lowStockCount: lowStock.length,
      expiringSoonCount: expiringSoon.length,
      lowStockMedicines: lowStock,
      expiringSoonMedicines: expiringSoon,
      salesChartData,
      categoryChartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { MongoMemoryServer } = require('mongodb-memory-server');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('Connected to In-Memory MongoDB');
    
    // Seed some initial data for testing
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('Test admin created (admin / admin123)');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();
