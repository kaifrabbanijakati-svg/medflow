const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal, tax, total } = req.body;
    
    // Deduct stock
    for (const item of items) {
      const med = await Medicine.findById(item.medicine);
      if (med) {
        if (med.quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${med.name}` });
        }
        med.quantity -= item.quantity;
        await med.save();
      }
    }
    
    const sale = new Sale({ items, subtotal, tax, total });
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
