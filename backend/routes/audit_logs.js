import express from "express";
import db from "../Database/index.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if(req.session.user){
        next();
    } else{
        res.status(401).json({error: "Unauthorized. Please log in."});
    }
};

const isApproved = (req, res, next) => {
    if(req.session.user && req.session.user.role_id !== 5) {
        next();
    } else {
        res.status(403).json({error: "Access denied. Your account is pending Admin approval"});
    }
};

const isAuditorOrAdmin = (req, res, next) => {
    //logged in person should be auditor or admin to see the tables 
    if(req.session.user && (req.session.user.role_id === 1 || req.session.user.role_id === 2)){
        next();
    } else{
        res.status(403).json({error: "Access denied. Only admins and auditors can manage security logs."});
    }
};

router.get("/", isAuthenticated, isApproved, isAuditorOrAdmin, async(req, res) => {
    try{
        //we join the assets and users table so frontend can see all the things 
        const result = await db.query(
            `select al.id, al.action_details, al.severity, al.status, al.logged_at,
            a.name as asset_name, u.name as logged_by_user
            from audit_logs al
            left join assets a on al.asset_id = a.id
            left join users u on al.user_id = u.id
            order by al.logged_at desc`
        );

        res.status(200).json(result.rows);
    } catch(err){
        console.error("Error fetching audit logs:", err);
        res.status(500).json({error: "Failed to fetch audit logs"});
    }
});

//report a security event, any approved employee, if developer sees a bug, they should be able to see it
router.post("/", isAuthenticated, isApproved, async(req, res) => {
    try{
        const {asset_id, action_details, severity} = req.body;
        const user_id = req.session.user.id;

        const result = await db.query(
            `insert into audit_logs(asset_id, user_id, action_details, severity, status, logged_at)
            values ($1, $2, $3, $4, 'open', current_timestamp)
            returning *`, [asset_id, user_id, action_details, severity]
        );

        res.status(201).json({
            message: "Security event logged successfully! The audit team has been notified",
            log: result.rows[0]
        });
    } catch(err){
        console.error("Error creating audit log:", err);
        res.status(500).json({error: "Failed to create audit log"});
    }
});

//update log status(ex: changing open to resolved), only admin and auditors
router.put("/:id/status", isAuthenticated, isApproved, isAuditorOrAdmin, async(req, res) => {
    try{
        const logId = req.params.id;
        const {status} = req.body;

        const result = await db.query(
            `update audit_logs
            set status = $1
            where id = $2
            returning *`, [status, logId]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                error: "Audit log not found."
            });
        }

        res.status(200).json({
            message: "Audit log status updated successfully!",
            log: result.rows[0]
        });
    } catch(err){
        console.error("Error updating audit log:", err);
        res.status(500).json({error: "Failed to update audit log status"});
    }
});

export default router;