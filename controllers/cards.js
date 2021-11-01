const Card = require('../models/card');
const BadDataError = require('../errors/BadDataError');
const NotFoundError = require('../errors/NotFoundError');
const {
  errMsgs,
  errNames,
  resMsgs,
} = require('../utils/utils');

// GET /cards — returns all cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('cards')))
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards — creates a card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  if (!_id || !name || !link) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
  }

  Card.create({ name, link, owner: _id })
    .then((card) => {
      if (!card) {
        throw new BadDataError(errMsgs.ERR_MSG_NOT_CREATED('card'));
      } else {
        Card.findById(card._id)
          .populate(['owner', 'likes'])
          .then((populatedCard) => {
            res.send(populatedCard);
          });
      }
    })
    .catch(next);
};

// DELETE /cards/:cardId — deletes a card with cardId
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!cardId) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
  }

  Card.findByIdAndRemove(cardId)
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('card'));
    })
    .then(() => { res.send({ message: resMsgs.RES_MSG_CARD_DELETED }); })
    .catch(next);
};

// PUT /cards/:cardId/likes — adds a like to the card
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  if (!cardId) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
  }

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('card'));
    })
    .populate(['owner', 'likes'])
    .then((card) => { res.send(card); })
    .catch(next);
};

// DELETE /cards/:cardId/likes — removes a like from the card
module.exports.unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  if (!cardId) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('card'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('card'));
    })
    .populate(['owner', 'likes'])
    .then((card) => { res.send(card); })
    .catch(next);
};
