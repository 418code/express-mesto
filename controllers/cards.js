const Card = require('../models/card');
const {
  errCodes,
  errNames,
  errMsgs,
  resMsgs,
  sendErrRes,
} = require('../utils/utils');

// GET /cards — returns all cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message));
};

// POST /cards — creates a card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  if (!_id || !name || !link) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  Card.create({ name, link, owner: _id })
    .then((card) => {
      Card.findById(card._id)
        .populate(['owner', 'likes'])
        .then((populatedCard) => {
          res.send(populatedCard);
        });
    })
    .catch((err) => {
      if (err.name === errNames.VALIDATION) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_CARD_NOT_CREATED);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// DELETE /cards/:cardId — deletes a card with cardId
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_CARD_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ message: resMsgs.RES_MSG_CARD_DELETED }))
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_CARD_NOT_FOUND);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// PUT /cards/:cardId/likes — adds a like to the card
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  if (!cardId) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_CARD_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_CARD_NOT_FOUND);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// DELETE /cards/:cardId/likes — removes a like from the card
module.exports.unlikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  if (!cardId) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_CARD_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_CARD_NOT_FOUND);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};
