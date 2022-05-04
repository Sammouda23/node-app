
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const redis = require("redis")
const cors = require("cors")
let RedisStore = require("connect-redis")(session)







const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,

});



const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes");
const { Session } = require("express-session");






const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin `;
const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("BIEN V SAMMOUDA succes login to mydb-mongo"))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000)
        });
}

connectWithRetry();


app.enable("trust proxy");
app.use(cors({}))

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,

    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 30000

}));


app.use(express.json());
app.get('/api/v1', function (req, res) {
    res.send('Hello World! hi  sammouda');
    console.log("yes succed")
});

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('app listening on port $ {port}'));