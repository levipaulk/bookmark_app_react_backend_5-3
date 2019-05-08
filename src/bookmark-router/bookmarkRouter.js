const express = require('express');
const uuid = require('uuid/v4');
const { isWebUri} = require('valid-url');
const logger = require('../logger');
const bookmarkDatabase = require('../bookmarks-database/bookmarks-database');
const BookmarksService = require('../bookmark-service');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    rating: Number(bookmark.rating),
})

bookmarkRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db');
        BookmarksService.getAllBookmarks(db)
            .then(bookmarks => {
                res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const db = req.app.get('db');

        for (const field of ['title', 'url', 'rating']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }
        const { title, url, description, rating } = req.body
        
        if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }
      
        if (!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send(`'url' must be a valid URL`)
        }

        const bookmark = {title, url, description, rating}

        BookmarksService.insertBookmark(db, bookmark)
            .then(result => {
                const resId = (result.id);
                console.log(resId);
                res.status(201).location(`http://localhost:8000/bookmarks/${resId}`).json(serializeBookmark(result))
            })
            .catch(next)
    })

bookmarkRouter
    .route('/:id')
    .get((req, res, next) => {
        const db = req.app.get('db');
        const {id} = req.params;
        // const bookmark = bookmarkDatabase.find( b => b.id === id);
        BookmarksService.getById(db, id)
            .then(bookmark => {
                if(!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`);
                return res
                    .status(404)
                    .json({ error: { message: `Bookmark Not Found`}});
                }
                res.json(serializeBookmark(bookmark))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const bookmarkIndex = bookmarkDatabase.findIndex( b => b.id == id );

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not found');
        }

        bookmarkDatabase.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);
        res
            .status(204)
            .end();
    })

module.exports = bookmarkRouter