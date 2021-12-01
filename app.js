require('dotenv').config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(require('./middleware/headers'));

const controllers = require("./controllers");

app.use(Express.json());


app.use("/log", controllers.logController);
// app.use(require('./middleware/validate-jwt'));
app.use("/user", controllers.userController);

// app.use('/test', (req, res) => {
//     res.send('This is a test!')
// })

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(3005, () => {
            console.log(`[Server]: App is listening on 3005.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. error = ${err}`);
    })

