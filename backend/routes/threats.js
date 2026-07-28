//If this specific computer is infected right now, how fast will the virus spread across our cables, 
// which devices are going to be destroyed next, and how dangerous is the risk to our main servers?

import express from "express";
import db from "../Database/index.js";

const router = express.Router();

function isAuthenticated(req, res, next){
    if(req.session.user){
        next();
    } else{
        res.status(401).json({
            error: "Unauthorized, please log in."
        });
    }
}

function isApproved(req, res, next){
    if(req.session.user && req.session.user.role_id !== 5){
        next();
    } else{
        res.status(403).json({
            error: "Access denied. Your account is pending admin approval."
        })
    }
}

router.get("/:id/graph", isAuthenticated, isApproved, async(req, res) => {
    try{
        //parseInt converts string into clean int type 
        const rootAssetId = parseInt(req.params.id);

        //Fetch all assets to act as our graph nodes
        const assetsResult = await db.query(
            `select id, name, description
            from assets`
        );
        const nodes = assetsResult.rows;

        //Fetch all connections to act as our Graph Edges
        const edgesResult = await db.query(
            `select source_asset_id, target_asset_id
            from network_connections`
        );
        const edges = edgesResult.rows;

        //building the adjacency list
        const adjacencyList = {};
        //setting up empty slots so later be filled in
        nodes.forEach((node) => {
            adjacencyList[node.id] = []
        });
        edges.forEach((edge) => {
            if(adjacencyList[edge.source_asset_id]){
                adjacencyList[edge.source_asset_id].push(edge.target_asset_id)
            }
        });

        //Run the BFS algo
        const visited = {};
        //Initialize every single node to false unvisited
        nodes.forEach((node) => {
            visited[node.id] = false;
        });

        const queue = [{id: rootAssetId, depth: 0}];
        //it's like a answer map, after popping out from queue we need to store them somewhere so we need this. 
        const threatmap = [];

        while(queue.length > 0){
            const current = queue.shift();

            //if the node is visited then skip it
            if(visited[current.id] === true) continue;

            visited[current.id] = true;

            const assetData = nodes.find((n) => n.id === current.id);

            const riskScore = Math.round(100 / Math.pow((current.depth + 1), 2));

            threatmap.push({
                asset_id: current.id,
                name: assetData?.name || "Unknown Asset",
                depth: current.depth,
                risk_score: riskScore
            });

            //add all neighbors
            const neighbors = adjacencyList[current.id] || [];
            for(let neighborId of neighbors){
                if(!visited[neighborId]){
                    queue.push({
                        id: neighborId,
                        depth: current.depth + 1
                    });
                }
            }
        }

        res.status(200).json({
            root_asset: rootAssetId,
            threat_analysis: threatmap,
            raw_topology: {nodes, edges}
        });
    } catch(err){
        console.error("Error generating threat graph:", err);
        res.status(500).json({
            error: "Failed to generate BFS threat propagation graph."
        })
    }
});

export default router;