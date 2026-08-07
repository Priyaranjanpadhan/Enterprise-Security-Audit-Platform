import express from "express";
import bcrypt from "bcrypt";
import db from "../Database/index.js";
import passport from "passport";


const saltRounds = 10;
const router = express.Router(); //as we can't use app.get or app.post we need this it's like an extension cord that is required to join app.get post into this file

router.post("/register", async(req, res) => {
    // We accept phone and contacts and several others from frontend
    const {name, email, password, phone, address} = req.body;

    try{
        const checkResult = await db.query("select * from users where email = ($1)", [email]);
        //check if employee email is already registered
        if(checkResult.rows.length > 0){
            return res.status(400).json({error: "Email already exists. Please log in."})
        }

        //Hash the password for security
        const hash = await bcrypt.hash(password, saltRounds);

        //Insert the new user. We strictly hardcode '5' (pending) to lock down the account until admin approval.
        const result = await db.query(
            `insert into users (name, email, password_hash, role_id, phone, address)
            values($1, $2, $3, $4, $5, $6) returning id, name, role_id`, 
            [name, email, hash, 5, phone || null, address || null]
        );

        const newUser = result.rows[0];

        // Save their identity and role into the postfreSql session
        //This is the beauty of using "middleware" like express-session. Because you configured the session package once in your main server.js file, 
        // it acts like an invisible manager. The exact second you say req.session.user = ..., the package quietly steps in, generates the encrypted key, 
        // and attaches the Set-Cookie command to the response before it leaves the server. You never have to manually write the cookie code in your login route!
        req.session.user = {
            id: newUser.id, 
            name: newUser.name,
            role_id: newUser.role_id
        };

        //send the successful status and account is pending access
        res.status(201).json({
            message: "Registration successful! Your account is pending Admin approval.",
            user: req.session.user
        });
    } catch(err){
        console.error("Error registrating user:", err);
        res.status(500).json({error: "Internal server error."})
    }
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    //console.log("Login attempt for email: ", req.body.email);

    try{
        const result = await db.query(
            `select * from users
            where email = $1`, [email]
        );
        //console.log("Database returned this user: ", result.rows);
        //check if user is present or not in database
        if(result.rows.length === 0){
            return res.status(401).json({error: "User not found."});
        }

        const user = result.rows[0];

        //Prevent local login if they originally used Google OAuth
        if(user.password_hash === "google_oauth"){
            return res.status(400).json({error: "Please log in using Google."});
        }

        //compare the typed password with the password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(401).json({error: "Incorrect password"});
        }

        //Save their identity and role into the postgreSQL session
        req.session.user = {
            id: user.id,
            name: user.name, 
            role_id: user.role_id
        };

        res.status(200).json({message: "Login Successful!", user: req.session.user});
    } catch(err){
        console.error("Error logging in: ", err);
        res.status(500).json({error: "Internal server error"});
    }
});

router.post("/logout", (req, res) => {
    //res.session.destroy to kill the session in postgresql
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({error: "Failed to log out."});
        }
        //to wipe the cookies from the user's browser is exactly how professional enterprise applications handle secure logouts
        res.clearCookie("connect.sid");
        res.status(200).json({message: "Logged out successfully"});
    });
});

router.get("/google", 
    //passport.authenticate here does not trigger the code in app.js. Its only job is to generate a massive, secure URL and redirect the user's browser away from your site and over to accounts.google.com.
    passport.authenticate("google", {scope: ["profile", "email"]}) //When you write scope: ["profile", "email"], you are explicitly telling the Google bouncer: "I don't want to see their private files. I only want permission to read their basic public profile and their email address." This is why Google's consent screen will specifically say to the user, "Enterprise Security Audit wants to access your name and email address."
);

router.get("/google/callback", 
    //When the user returns from Google, this passport.authenticate does the heavy lifting. It takes the secret code Google handed the user, talks to Google's servers securely behind the scenes, and this is what triggers the GoogleStrategy code inside app.js to fetch the profile and run the cb (callback).
    passport.authenticate("google", {failureRedirect: "/login"}), //if they deny the permission then local login
    (req, res) => {
        //google verified them passport automatically attached their google profile to req.user

        req.session.user = {id: req.user.databaseId, name: req.user.displayName, role_id: req.user.roleId};

        res.status(200).json({message: "google login successful!", user: req.session.user});
    }
);

export default router;