const express = require('express');
const { Router } = require('express');
const Messages = require('./model');
const Sse = require('json-sse');
const router = new Router();

// Initialize the event source
const stream = new Sse();

router.get('/stream', (request, response, next) =>
  Messages.findAll({ attributes: ['message'] })
    .then(mess => {
      const tmp = mess.map(em => {
        return em.message;
      });
      const json = JSON.stringify(tmp);
      stream.updateInit(json);
      stream.init(request, response);
    })
    .catch(error => next(error))
);

// router.get('/stream', (request, response, next) =>
//   Messages.findAll()
//     .then(mess => response.send(mess))
//     .catch(error => next(error))
// );

//Post a message
router.post('/message', (req, res, next) => {
  Messages.create(req.body)
    .then(message => {
      Messages.findAll({ attributes: ['message'] })
        .then(mess => {
          const tmp = mess.map(em => {
            return em.message;
          });
          const json = JSON.stringify(tmp);

          stream.send(json);

          res.status(201).json({
            message: 'A New Message Was Added',
            'new Messages': message
          });
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

module.exports = router;
