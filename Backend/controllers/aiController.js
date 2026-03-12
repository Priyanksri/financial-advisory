import Groq from "groq-sdk";
import Transaction from "../models/Transaction.js";

export const getInsights = async (req, res) => {
  try {
    // Get user's transactions from DB
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions found. Add some transactions first!",
      });
    }

    // Format transactions for Groq
    const transactionData = transactions.map((t) => ({
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: t.date,
    }));

    // Build the prompt
    const prompt = `
      You are a personal finance advisor. Analyze the following transaction data and provide insights.
      
      Transaction Data:
      ${JSON.stringify(transactionData, null, 2)}
      
      Please provide:
      1. Top spending categories
      2. Compare income vs expenses
      3. 3 specific tips to cut expenses
      4. One savings tip
      
      Keep the response clear, concise and friendly.
    `;

    // Call Groq API
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const insights = completion.choices[0].message.content;

    res.json({ insights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
