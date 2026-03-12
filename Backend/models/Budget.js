import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Salary",
                "food",
                "rent",
                "entertainment",
                "transport",
                "health",
                "shopping",
                "other",
            ]
        },
        amount: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Budget", budgetSchema);