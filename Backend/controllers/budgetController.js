import Budget from '../models/Budget.js';

export const setBudget = async (req, res) => {
    const { category, amount, month, year } = req.body;

    try {

        const existingBudget = await Budget.findOne({ 
            user: req.user._id, 
            category, 
            month, 
            year,
        });

        if (existingBudget) {
            existingBudget.amount = amount;
            await existingBudget.save();
            return res.json(existingBudget);
        }

        const budget = await Budget.create({
            user: req.user._id,
            category,
            amount,
            month,
            year
        });
        res.status(201).json(budget);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/budgets
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(budgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// PATCH /api/budgets/:id
export const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};