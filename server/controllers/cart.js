import mongoose from 'mongoose';

import { CART } from '../models/Cart.js';
import { BOOK } from '../models/Book.js';
import { RECEIPT } from '../models/Receipt.js';
import { USER } from '../models/User.js';

export const getCartSize = async (req, res) => {
  let userId = req.user.id;
  console.log('CHECK USER: ' + req.user.username);
  CART.findOne({ user: userId }).then((cart) => {
    res.status(200).json({
      message: '',
      data: cart.books.length,
    });
  });
};

export const getCart = async (req, res) => {
  let userId = req.user.id;

  CART.findOne({ user: userId })
    .populate('books')
    .then((cart) => {
      res.status(200).json({
        message: '',
        data: cart,
      });
    });
};

export const addToCart = async (req, res) => {
  let userId = req.user.id;
  let bookId = req.params.bookId;

  BOOK.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(400).json({
          message: 'There is no book with the given id in our database.',
        });
      }

      CART.findOne({ user: userId }).then((cart) => {
        let bookIds = [];

        for (let b of cart.books) {
          bookIds.push(b.toString());
        }

        if (bookIds.indexOf(bookId) !== -1) {
          return res.status(400).json({
            message: 'Book is already in your cart',
          });
        }

        cart.books.push(bookId);
        cart.totalPrice += book.price;
        cart.save();

        res.status(200).json({
          message: 'Book added to cart!',
          data: cart,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: 'Something went wrong, please try again.',
      });
    });
};

export const removeFromCart = async (req, res) => {
  let userId = req.user.id;
  let bookId = req.params.bookId;

  BOOK.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(400).json({
          message: 'There is no book with the given id in our database.',
        });
      }

      CART.findOne({ user: userId }).then((cart) => {
        cart.books = cart.books
          .map((b) => b.toString())
          .filter((b) => b !== bookId);
        cart.totalPrice -= book.price;
        cart.save();

        res.status(200).json({
          message: 'Book removed from cart!',
          data: cart,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: 'Something went wrong, please try again.',
      });
    });
};

export const removeAllFromCart = async (req, res) => {
  let userId = req.user.id;

  CART.findOne({ user: userId })
    .then((cart) => {
      if (!cart) {
        return res.status(400).json({
          message: 'Cart not found for the user.',
        });
      }

      cart.books = [];
      cart.totalPrice = 0;

      cart
        .save()
        .then(() => {
          res.status(200).json({
            message: 'All items removed from the cart.',
            data: cart,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            message: 'Internal server error. Please try again.',
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: 'Internal server error. Please try again.',
      });
    });
};

export const checkout = async (req, res) => {
  let userId = req.user.id;
  let totalPrice = 0;
  let products = [];

  CART.findOne({ user: userId })
    .populate('books')
    .then((cart) => {
      for (let book of cart.books) {
        let qty = req.body[book._id.toString()];
        totalPrice += book.price * qty;
        products.push({
          id: book._id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          price: book.price,
          qty: qty,
        });

        BOOK.updateOne({ _id: book._id }, { $inc: { purchasesCount: qty } })
          .then((res) => {
            console.log(
              `Purchases count updated: ${book.title} - added qty: ${qty}`,
              res
            );
          })
          .catch((err) => {
            console.log('Purchases count erro: ', err);
          });
      }

      RECEIPT.create({
        user: userId,
        productsInfo: products,
        totalPrice: totalPrice,
      })
        .then((receipt) => {
          USER.updateOne(
            { _id: userId },
            { $push: { receipts: receipt._id } }
          ).then(() => {
            cart.books = [];
            cart.totalPrice = 0;
            cart.save();
            return res.status(200).json({
              message:
                'Thank you for your order! Books will be sent to you as soon as possible!',
              data: receipt,
            });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            message: 'Something went wrong, please try again.',
          });
        });
    });
};
