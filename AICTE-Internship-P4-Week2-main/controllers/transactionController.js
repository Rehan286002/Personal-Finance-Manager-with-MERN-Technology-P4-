/*import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      date,
      category,
      userId,
      transactionType,
    } = req.body;

    // console.log(title, amount, description, date, category, userId, transactionType);

    if (
      !title ||
      !amount ||
      !description ||
      !date ||
      !category ||
      !transactionType
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let newTransaction = await Transaction.create({
      title: title,
      amount: amount,
      category: category,
      description: description,
      date: date,
      user: userId,
      transactionType: transactionType,
    });

    user.transactions.push(newTransaction);

    user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    console.log(userId, type, frequency, startDate, endDate);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a query object with the user and type conditions
    const query = {
      user: userId,
    };

    if (type !== 'all') {
      query.transactionType = type;
    }

    // Add date conditions based on 'frequency' and 'custom' range
    if (frequency !== 'custom') {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate()
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }

    // console.log(query);

    const transactions = await Transaction.find(query);
    //select * from transaction where date>18/02/2025
    // console.log(transactions);

    return res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};


export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    const transactionArr = user.transactions.filter(
      (transaction) => transaction._id === transactionId
    );

    user.transactions = transactionArr;

    user.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction successfully deleted`,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const { title, amount, description, date, category, transactionType } =
      req.body;

    console.log(title, amount, description, date, category, transactionType);

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (title) {
      transactionElement.title = title;
    }

    if (description) {
      transactionElement.description = description;
    }

    if (amount) {
      transactionElement.amount = amount;
    }

    if (category) {
      transactionElement.category = category;
    }
    if (transactionType) {
      transactionElement.transactionType = transactionType;
    }

    if (date) {
      transactionElement.date = date;
    }

    await transactionElement.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};
*/


import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';

export const createTransaction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const transaction = new Transaction({...req.body, userId: req.user.userId});
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error("Transaction creation error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({userId: req.user.userId});
        res.json(transactions);
    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error("Delete transaction error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const bulkDeleteTransactions = async (req, res) => {
    try {
        const transactionIds = req.body.ids;
        await Transaction.deleteMany({ _id: { $in: transactionIds }, userId: req.user.userId });
        res.json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        console.error("Bulk delete error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({_id: req.params.id, userId: req.user.userId});
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        console.error("Single transaction fetch error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};