const Router = require("express").Router;
const router = new Router();

const ExpressError = require("../expressError");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', async (req, res, next) => {
    try {
        const users = User.all();
        return res.json({ users });

    } catch (e) {
        return next(e);
    }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', async (req, res, next) => {
    try {
        const { username } = req.params.username;
        if (!username) {
            throw new ExpressError("Username required", 400);
        }
        const user = User.get(username);
        return res.json({ user });

    } catch (e) {
        return next(e);
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', async (req, res, next) => {
    try {
        const { username } = req.params.username;
        if (!username) {
            throw new ExpressError("Username required", 400);
        }
        const messages = await User.messagesTo(username);
        return res.json({ messages: messages });

    } catch (e) {
        return next(e);
    }
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', async (req, res, next) => {
    try {
        const { username } = req.params.username;
        if (!username) {
            throw new ExpressError("Username required", 400);
        }
        const messages = await User.messagesFrom(username);
        return res.json({ messages: messages });

    } catch (e) {
        return next(e);
    }
});


module.exports = router;