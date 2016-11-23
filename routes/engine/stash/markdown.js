/**
 * Created by qlba on 23.11.2016.
 */

var router = require('express').Router();

router.get(
    '/engine/stash/markdown',
    function(req, res, next)
    {
        res.render(
            'engine/stash/markdown',
            {}
        );
    }
);

router.post(
    '/engine/stash/markdown-commit',
    function(req, res, next)
    {
        res.render(
            'engine/stash/markdown-commit',
            {
                markdown: req.body['markdown'],
                mkdn: require('markdown').markdown.toHTML
            }
        );
    }
);

module.exports = router;