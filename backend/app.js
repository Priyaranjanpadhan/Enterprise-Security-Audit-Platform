import express from "express";
import db from "./Database/index.js";
import authRouter from "./routes/auth.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import env from "dotenv";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import cors from "cors";
import userRouter from "./routes/user.js";
import assetRouter from "./routes/assets.js";
import auditLogRouter from "./routes/audit_logs.js";
import threatRouter from "./routes/threats.js";

const app = express();
const port = 3000;
env.config();
const pgSession = connectPgSimple(session);

//middleware
app.use(express.json());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, "http://localhost:5173", "https://www.priyaranjan.me"], //we are giving the frontend to access any of these three
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true //it allows react to receive and send the session cookies
    })
);

app.set("trust proxy", 1); //by default, browsers block cookies from passing between two different URLs, we must tell express to froce cross-site cookies and trust the cloud load balancer
app.use(
    session({
        store: new pgSession({
            pool: db,
            tableName: 'sessions',
            createTableIfMissing: false
        }),
        secret:  process.env.SESSION_SECRET, //This will lock the cookie
        resave: false, //don't save the session if nothing changes
        saveUninitialized: false, //don't give someone cookies if they are not logged in
        cookie: {
            //true for render(HTTPS) false for localhost
            secure: process.env.NODE_ENV === "production",
            //"none" allows cross-domain cookies, "lax" for localhost
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 //This calculates how much the cookie will be saved into the browsers memory
        }
    })
);

//Initialize passport so it can tap into express-session
app.use(passport.initialize());
app.use(passport.session());

//configuring google strategy
passport.use(
    new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //http://localhost:3000 + /api/auth/google/callback
        //https://enterprise-security-audit-platform.onrender.com](https://enterprise-security-audit-platform.onrender.com) + /api/auth/google/callback
        //That is exactly how we got [https://enterprise-security-audit-platform.onrender.com/api/auth/google/callback]
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback"
        // accessToken  -> Temporary key to perform actions on behalf of the user.
        // refreshToken -> Permanent key used to renew the expired access token.
        // profile -> User identity payload (email, photo, name) requested from Google.
        // cb/done -> Dispatches the retrieved profile data back to the local auth pipeline.

    }, async(accessToken, refreshToken, profile , cb) => {
        //real magic happens here google just sent us the user's profile, 
        //console.log("Google Profile Data : ", profile);

        //console.log(profile);

        try{
            const email = profile.emails[0].value;
            const name = profile.displayName;

            //check if the google email already exists. Here we combine both /login and /register pages into one cause we don't need to verify if the user is valid or not that will be done by the google so we can safely if exists then access if not then import it into the tables for future reference because we inherently trust google
            const result = await db.query(
                `select id, name, role_id
                from users
                where email = $1`,
                [email]
            ); 
            if(result.rows.length === 0){//new user
                //we will insert "google-oauth" as a placeholder since they don't have a local password thus by no hash
                const resultUser = await db.query(
                    "insert into users (name, email, password_hash, role_id) values ($1, $2, $3, $4) returning id, role_id", 
                    [name, email, "google_oauth", 5]
                );
                profile.databaseId = resultUser.rows[0].id;
                profile.roleId = resultUser.rows[0].role_id;
            } else {
                profile.databaseId = result.rows[0].id;
                profile.roleId = result.rows[0].role_id;
            }
            //console.log(profile);
            //hand the profile back to the passport
            return cb(null, profile);
        } catch(err){
            return cb(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
})

//This assistant stands at the door, catches all those data packets, stitches them together, silently runs JSON.parse() for you, and neatens everything up. 
// By the time the data reaches your actual route, it is already perfectly formatted and waiting for you inside the req.body variable.
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/assets", assetRouter);
app.use("/api/audit-logs", auditLogRouter);
app.use("/api/threats", threatRouter);

//it is needed for the cron-job.org for constant ping so it needs a constant end point to actually look at and not give error
app.get("/api", (req, res) => {
    res.status(200).json({status: "Server is awake and running just fine!"});
});

app.listen(port, () => {
    console.log(`server running on port ${port}`)
});