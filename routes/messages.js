const Router = require("express").Router;
const router = new Router();

const ExpressError = require("../expressError");
const Message = require("../models/message");

const jwt = require("jsonwebtoken");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params.id;
        if (!id) {
            throw new ExpressError("Message id required", 400);
        }
        const message = Message.get(id);
        return res.json({ message: message })

    } catch (e) {
        return next(e);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        if (!to_username || !body) {
            throw new ExpressError("To Username and body required", 400);
        }
        const message = Message.create(req.user, to_username, body);
        return res.json({ message: message })

    } catch (e) {
        return next(e);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async (req, res, next) => {
    try {
        const { id } = req.params.id;
        if (!id) {
            throw new ExpressError("Message id required", 400);
        }
        const message = Message.markRead(id);
        return res.json({ message: message })

    } catch (e) {
        return next(e);
    }
});

module.exports = router;