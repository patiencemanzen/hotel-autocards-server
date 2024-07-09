/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from "express";
import { Card, Customer, CustomerId } from "../models";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { handleMongoError } from "../helpers/mongoose-healpers";
import mongoose from "mongoose";

dotenv.config();

/**
 * Controller function for user login
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param _req - Express Request object
 * @param res - Express Response object
 */
export const index = async (_req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const customers = await Customer.find({});

      res.status(201).send({
        status: "success",
        customer: customers,
        message: "customer found successfully",
      });
    },
    (error) => {
      console.error("Error fetching customers:", error);
      throw error;
    }
  );
};

/**
 * Controller function for user login
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { id } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "error",
          errors: errors.array(),
          message: "Validation failed",
        });
      }

      const customer = await CustomerId.findOne({ card_id: id }).populate(
        "customer"
      );

      if (!customer)
        return res
          .status(401)
          .send({ status: "error", message: "Id Not found" });

      res.status(201).send({
        status: "success",
        customer: customer,
        message: "customer found successfully",
      });
    },
    (error) => {
      if (error instanceof mongoose.Error) {
        const {
          status,
          error: errorMessage,
          details,
        } = handleMongoError(error);
        return res.status(status).json({ error: errorMessage, details });
      }

      return res.status(400).json({
        status: "error",
        error: error,
        message: error.message || "Unable to find customer",
      });
    }
  );
};

/**
 * Controller function for user login
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const showCustomer = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { id } = req.params;

      const customer = await Customer.findOne({ _id: id });
      const customerId = await CustomerId.findOne({ customer: id });

      if (!customer) {
        return res.status(404).send({
          status: "error",
          message: "Customer ID not found",
        });
      }

      res.status(200).send({
        status: "success",
        data: { customer: customer, customerId: customerId }, // Changed 'customer' to 'data' for clarity
        message: "Customer found successfully",
      });
    },
    (error) => {
      if (error instanceof mongoose.Error) {
        const { status, error: mongoError, details } = handleMongoError(error);
        return res.status(status).json({ error: mongoError, details });
      }

      return res.status(400).json({
        status: "error",
        message: error.message || "Unable to find customer",
      });
    }
  );
};

/**
 * Controller function for user signup
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const register = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { fullname, email, national, passport, payment_method } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const customer = await Customer.create({
        fullname,
        email,
        passport,
        national,
        payment_method,
      });

      res.status(201).send({
        status: "success",
        customer: customer,
        message: "Customer registered successfully",
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};

export const postCards = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { name, card_number } = req.body;

      const card = await Card.create({
        name: name.toLocaleLowerCase(),
        serial_number: card_number,
      });

      res.status(201).send({
        status: "success",
        card: card,
        message: "Card registered successfully",
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};

export const getCards = async (_req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const cards = await Card.find({});

      res.status(201).send({
        status: "success",
        cards: cards,
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};

export const showCard = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { id } = req.params;
      const card = await Card.findOne({ _id: id });

      res.status(200).send({
        status: "success",
        card: card,
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};

export const assignCard = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { card_id, customer_id } = req.body;

      const currentCustomerWithCard = await CustomerId.findOne({
        customer: customer_id,
        card_id: card_id,
      });

      if (currentCustomerWithCard) {
        currentCustomerWithCard.customer = customer_id;
        currentCustomerWithCard.save();
      } else {
        await CustomerId.create({
          customer: customer_id,
          card_id: card_id,
        });
      }
      const newCustomerId = await CustomerId.findOne({
        customer: customer_id,
        card_id: card_id,
      }).populate("customer");

      res.status(201).send({
        status: "success",
        card: newCustomerId,
        message: "Card assignment successfully",
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};
