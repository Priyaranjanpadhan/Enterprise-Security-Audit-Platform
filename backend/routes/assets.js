import express from "express";
import db from "../Database/index.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if(req.session.user){
        next();
    } else {
        res.status(401).json({error:"Unauthorized, Please log in."});
    }
};

const isApproved = (req, res, next) => {
    if(req.session.user && req.session.user.role_id != 5){
        next();
    } else{
        res.status(403).json({error: "Access denied. Your account is pending admin approval."});
    }
};

//get all assets 
router.get("/", isAuthenticated, isApproved, async(req, res) => {
    try{
        //check the user's role_id and user_id to who he is and what assets can he see using the role_id
        const userRoleId = req.session.user.role_id;
        const userId = req.session.user.id;

        let query = "";
        let values = [];

        if(userRoleId === 1 || userRoleId === 2){
            query = `
                select assets.id, assets.name as asset_name, assets.description, users.name as owner_name, users.email
                from assets
                left join users on assets.current_owner_id = users.id
                order by assets.id asc`;
        } else if(userRoleId === 3 || userRoleId === 4){
            query = `
                select assets.id, assets.name as asset_name, assets.description, users.name as owner_name, users.email
                from assets
                left join users on assets.current_owner_id = users.id
                where assets.current_owner_id = $1 
                order by assets.id asc`;
            values = [userId];
        } else{
            //if the user role_id is 5 then
            //don't crash
            return res.status(200).json([]);
        }

        const result = await db.query(query, values);
        res.status(200).json(result.rows);
    } catch(err){
        console.error("Error fetching assets:", err);
        res.status(500).json({error: "Acees denied. Your account is pending admin approval."});
    }
});

//add a new assets
router.post("/", isAuthenticated, isApproved, async(req, res) => {
    try{
        const {name, description} = req.body;

        const result = await db.query(
            `insert into assets (name, description)
            values ($1, $2) returning *`,
            [name, description]
        );

        res.status(201).json({
            message: "Asset added successfully to inventory!",
            asset: result.rows[0]
        });
    } catch(err){
        console.error("Error adding asset:", err);
        res.status(500).json({error: "Failed to add asset"});
    }
});

//assigning an asset to an employee
//allowed only admins and technicians
router.post("/:id/assign", isAuthenticated, isApproved, async(req, res) => {
    const assetId = req.params.id; //the id of laptop in URL
    const {assigned_to} = req.body; //the user ID of the employee receiving the hardware
    const assigned_by = req.session.user.id; //the id of the person making the request
    const userRoleId = req.session.user.role_id; //the role of the person making the request

    if(userRoleId !== 1 && userRoleId !== 3){
        return res.status(403).json({
            error: "Access denied. Only admins and technicians can assign assets."
        })
    }

    try{
        //start the SQL transaction
        await db.query("begin");

        //Update the master inventory
        await db.query(
            `update assets
            set current_owner_id = $1
            where id = $2`,
            [assigned_to, assetId]
        );

        //create the permanent audit trail, we use current_timestamp to log the exact second they were given the asset
        await db.query(
            `insert into asset_assignments (asset_id, assigned_by, assigned_to, assigned_at)
            values ($1, $2, $3, current_timestamp)`,
            [assetId, assigned_by, assigned_to]
        );

        //save both operations permanently
        await db.query("commit");

        res.status(200).json({
            message: "Asset successfully assigned and logged!"
        });
    } catch(err){
        await db.query("rollback");
        console.error("Error assigning asset:", err);
        res.status(500).json({
            error: "Failed to assign asset"
        });
    }
});

//Edit an asset's description
router.put("/:id", isAuthenticated, isApproved, async(req, res) => {
    try{
        const assetId = req.params.id;
        const {description} = req.body;
        const userRoleId = req.session.user.role_id;

        if(userRoleId !== 1 && userRoleId !== 3){
            return res.status(403).json({error: "Only admins and technicians can edit assets."})
        }

        const result = await db.query(
            `update assets
            set description = $1
            where id = $2
            returning *`,
            [description, assetId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error: "Asset not found"});
        }

        res.status(200).json({message: "Asset updated successfully!", asset: result.rows[0]});
    } catch(err){
        console.error("Error updating asset:", err);
        res.status(500).json({error: "Failed to update asset."});
    }
});

router.delete(":/id", isAuthenticated, isApproved, async(req,res) => {
    try{
        const assetId = req.params.id;
        const userRoleId = req.session.user.role_id;

        if(userRoleId !== 1){
            res.status(403).json({error: "Access denied. Only admins can delete assets."})
        }

        const result = await db.query(`delete from assets where id = $1 returning *`, [assetId]);

        if(result.rows[0].length === 0){
            return res.status(404).json({error: "Asset not found."});
        }

        res.status(200).json({
            message: "Asset successfully retired from the system."
        })
    } catch(err){
        console.error("Error deleting assets:", err);
        res.status(500).json({error: "Failed to delete assets, It may be still assigned to a user."});
    }
});

export default router;