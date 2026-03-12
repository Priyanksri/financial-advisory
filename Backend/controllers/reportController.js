import puppeteer from "puppeteer";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

export const generatePDFReport = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0),
      },
    }).sort({ date: -1 });

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpenses;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #4F46E5; text-align: center; }
            h2 { color: #4F46E5; margin-top: 30px; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .card { background: #f3f4f6; padding: 20px; border-radius: 8px; flex: 1; text-align: center; }
            .card h3 { margin: 0; font-size: 14px; color: #6b7280; }
            .card p { margin: 8px 0 0; font-size: 24px; font-weight: bold; }
            .income { color: #10b981; }
            .expense { color: #ef4444; }
            .savings { color: #4F46E5; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #4F46E5; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) { background: #f9fafb; }
            .footer { text-align: center; margin-top: 40px; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>💰 Finance Report — ${month}/${year}</h1>

          <div class="summary">
            <div class="card">
              <h3>Total Income</h3>
              <p class="income">$${totalIncome.toLocaleString()}</p>
            </div>
            <div class="card">
              <h3>Total Expenses</h3>
              <p class="expense">$${totalExpenses.toLocaleString()}</p>
            </div>
            <div class="card">
              <h3>Savings</h3>
              <p class="savings">$${savings.toLocaleString()}</p>
            </div>
          </div>

          <h2>📋 Transactions</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
            ${transactions
              .map(
                (t) => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.type}</td>
                <td>${t.category}</td>
                <td>${t.description || "-"}</td>
                <td style="color: ${t.type === "income" ? "#10b981" : "#ef4444"}">
                  ${t.type === "income" ? "+" : "-"}$${t.amount.toLocaleString()}
                </td>
              </tr>
            `
              )
              .join("")}
          </table>

          <h2>🎯 Budget vs Actual</h2>
          <table>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Actual Spent</th>
              <th>Status</th>
            </tr>
            ${budgets
              .map((b) => {
                const actual = transactions
                  .filter(
                    (t) => t.category === b.category && t.type === "expense"
                  )
                  .reduce((sum, t) => sum + t.amount, 0);
                const status = actual > b.amount ? "⚠️ Over Budget" : "✅ On Track";
                return `
                <tr>
                  <td>${b.category}</td>
                  <td>$${b.amount.toLocaleString()}</td>
                  <td>$${actual.toLocaleString()}</td>
                  <td>${status}</td>
                </tr>
              `;
              })
              .join("")}
          </table>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} • Finance Dashboard
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" }); // ← fixed here
    
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=finance-report-${month}-${year}.pdf`
    );
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};