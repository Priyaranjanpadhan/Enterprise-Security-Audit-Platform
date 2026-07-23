import express from "express";
import db from "../Database/index.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if(req.session.user){
        next();
    } else {
        res.status(401).json({error: "Unauthorized. Please Log in."})
    }
};

//Blocks pending role_id from doing any actual work
const isApproved = (req, res, next) => {
    if(req.session.user && req.session.user.role_id != 5) next();
    else {
        res.status(403).json({error: "Access denied. Your account is pending Admin approval."})
    }
};

//only lets admin pass
const isAdmin = (req, res, next) => {
    if(req.session.user && req.session.user.role_id === 1){
        next();
    } else {
        res.status(403).json({error: "Access denied. Admins only."})
    }
};

router.get("/profile", isAuthenticated, async(req, res) => {
    try{
        const userId = req.session.user.id;

        const result = await db.query(
            `select id, name, email, phone, address, role_id
            from users
            where id = $1`, [userId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error: "User profile not found."});
        }
        res.status(200).json(result.rows[0]);
    } catch(err){
        console.error("Error fetching profile: ", err);
        res.status(500).json({error: "Failed to fetch profile from the server"});
    }
});

router.put("/profile", isAuthenticated, async(req, res) => {
    try{
        const userId = req.session.user.id;
        const {name, phone, address} = req.body;

        //coalesce means if $1 is not null then name = $1 if null then name = name. like a ternary operator.
        const result = await db.query(
            `update users
            set name = coalesce($1, name),
                phone = coalesce($2, phone),
                address = coalesce($3, address)
            where id = $4 returning id, name, email, phone, address, role_id`,
            [name, phone, address, userId]
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });
    } catch(err){
        console.error("Error updating profile: ", err);
        res.status(500).json({error: "Failed to update profile."})
    }
});

//update the roles of the user role, we have to admin for that 
//client asks for the admin to change it's role, admin checks itself if he is admin or not. 
//if he is then he will extract the id of who wants to get change the role and client gave us the role in which he wants to get updated as
//so we have his current id and wants for role_id
router.put("/admin/users/:id/role", isAuthenticated, isAdmin, async(req, res) => {
    try{
        const targetUserId = req.params.id; //the parameter id one
        const {newRoleId} = req.body;

        const result = await db.query(
            `update users
            set role_id = $1 
            where id = $2
            returning id, name, role_id`, 
            [newRoleId, targetUserId]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json({
            message: "User role updated successfully!",
            user: result.rows[0]
        });
    } catch(err){
        console.error("Error updating role:", err);
        res.status(500).json({error: "Internal Server error"});
    }
});

export default router;