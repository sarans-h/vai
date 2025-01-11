import mongoose from "mongoose";
import validator from "validator"; // Import validator for email validation

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    wallet: {
      type: Number,
      default: 1000,
    },
    dailyPortfolio: [
      {
        date: {
          type: Date,
          default: Date.now
        },
        value: {
          type: Number,
          default: 1000
        }
      }
    ],
    profitLossHistory: [ // New field for P/L history
      {
        date: {
          type: Date,
          default: Date.now
        },
        profitLoss: {
          type: Number,
          default: 0
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Enabled timestamps for `createdAt` and `updatedAt`
);

const User = mongoose.model("User", userSchema); // Use ES Modules for consistency
export default User;
