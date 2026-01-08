import mongoose from 'mongoose';

import { COMMENT } from '../models/Comment.js';
import { BOOK } from '../models/Book.js';
import { USER } from '../models/User.js';

const PAGE_LIMIT = 5;

function validateCommentForm(payload) {
  let errors = {};
  let isFormValid = true;

  if (
    !payload ||
    typeof payload.content !== 'string' ||
    payload.content.trim().length < 1
  ) {
    isFormValid = false;
    errors.content = 'Comment must be more than 1 symbol long.';
  }
  if (
    !payload ||
    typeof payload.content !== 'string' ||
    payload.content.trim().length > 200
  ) {
    isFormValid = false;
    errors.content = 'Maximum number of characters are 200.';
  }

  return {
    success: isFormValid,
    errors,
  };
}

export const getComments = async (req, res) => {
  let bookId = req.params.bookId;
  let skipCount = !isNaN(Number(req.params.skipCount))
    ? Number(req.params.skipCount)
    : 0;

  try {
    const [totalComments, comments] = await Promise.all([
      COMMENT.countDocuments({ book: bookId }),
      COMMENT.find({ book: bookId })
        .populate({ path: 'user', select: 'username avatar' })
        .sort({ creationDate: -1 })
        .skip(skipCount)
        .limit(10),
    ]);

    res.status(200).json({
      message: '',
      totalCount: totalComments,
      data: comments,
    });
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      message: 'Something went wrong, please try again.',
    });
  }
};

export const getLatestFiveByUser = async (req, res) => {
  let userId = req.params.userId;

  COMMENT.find({ user: userId })
    .populate('book')
    .sort({ creationDate: -1 })
    .limit(5)
    .then((comments) => {
      res.status(200).json({
        message: '',
        data: comments,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        message: 'Something went wrong, please try again.',
      });
    });
};

export const add = async (req, res) => {
  let bookId = req.params.bookId;
  let userId = req.user.id;
  let comment = req.body.content;

  let validationResult = validateCommentForm(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Comment form validation failed!',
      errors: validationResult.errors,
    });
  }

  USER.findById(userId).then((user) => {
    if (!user || user.isCommentsBlocked) {
      return res.status(401).json({
        message: "Sorry, but you're not allowed to comment on books",
      });
    }

    BOOK.findById(bookId).then((book) => {
      if (!book) {
        return res.status(400).json({
          message: 'There is no book with the given id in our database.',
        });
      }

      COMMENT.create({ content: comment })
        .then((newComment) => {
          book.comments.push(newComment._id);
          newComment.book = book._id;
          newComment.user = userId;
          user.commentsCount += 1;

          user.save();
          book.save();
          newComment.save().then(() => {
            COMMENT.findById(newComment._id)
              .populate({ path: 'user', select: 'username avatar' })
              .then((comment) => {
                return res.status(200).json({
                  message: 'Comment posted successfully!',
                  data: comment,
                });
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
  });
};

export const edit = async (req, res) => {
  let commentId = req.params.commentId;
  let userId = req.user.id;
  let editedComment = req.body.content;

  let validationResult = validateCommentForm(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Comment form validation failed!',
      errors: validationResult.errors,
    });
  }

  USER.findById(userId).then((user) => {
    if (!user || user.isCommentsBlocked) {
      return res.status(401).json({
        message: "Sorry, but you're not allowed to comment on books",
      });
    }

    COMMENT.findById(commentId)
      .populate({ path: 'user', select: 'username avatar' })
      .then((comment) => {
        if (!comment) {
          return res.status(400).json({
            message: 'There is no comment with the given id in our database.',
          });
        }

        if (comment.user._id.toString() !== userId && !req.user.isAdmin) {
          return res.status(401).json({
            message: "You're not allowed to edit other user comments!",
          });
        }

        comment.content = editedComment;
        comment.save();

        return res.status(200).json({
          message: 'Comment edited successfully!',
          data: comment,
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

export const deleteComment = async (req, res) => {
  let commentId = req.params.commentId;
  let userId = req.user.id;

  COMMENT.findById(commentId)
    .then((comment) => {
      if (!comment) {
        return res.status(400).json({
          message: 'There is no comment with the given id in our database.',
        });
      }

      if (comment.user.toString() !== userId && !req.user.isAdmin) {
        return res.status(401).json({
          message: "You're not allowed to delete other user comments!",
        });
      }

      COMMENT.findByIdAndDelete(comment._id).then(() => {
        BOOK.updateOne(
          { _id: comment.book },
          { $pull: { comments: comment._id } }
        ).then(() => {
          USER.findById(req.user.id).then((user) => {
            user.commentsCount -= 1;
            user.save();
            return res.status(200).json({
              message: 'Comment deleted successfully!',
            });
          });
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
