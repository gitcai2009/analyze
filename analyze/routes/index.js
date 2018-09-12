module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/signin')
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/plat',require('./plat'));
    app.use('/place', require('./place'));
    app.use('/chart', require('./chart'));
    app.use('/set', require('./set'));

    app.use(function (req, res) {
        if (!res.headersSent){
            res.status(404).render('404')
        }
    })
};

