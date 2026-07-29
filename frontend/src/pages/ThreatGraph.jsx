import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import ForceGraph2D from "react-force-graph-2d";

function ThreatGraph(){
    const {id} = useParams(); //Get the root asset ID from URL itself
    const navigate = useNavigate();
    const graphRef = React.useRef();

    const [graphData, setGraphData] = React.useState({
        nodes: [],
        links: []
    });
    const [threatData, setThreatData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        async function fetchGraph(){
            try{
                const response = await api.get(`/threats/${id}/graph`);
                const data = response.data;//data will get the request from the threats.js whatever will return from there, you can see it in the last lines of threat.js res.json({.....})

                setThreatData(data.threat_analysis);

                //format the data exactly how ther graph engine expects it
                const formattedNodes = data.raw_topology.nodes.map((node) => {
                    //find if this node has a high risk score
                    const threatInfo = data.threat_analysis.find(t => t.asset_id === node.id);
                    const risk = threatInfo ? threatInfo.risk_score : 0;

                    //color coding based on depth and risk
                    let nodeColor = "#10B981"; // Safe Green
                    if(risk === 100) nodeColor = "#EF4444"; // Critical Red
                    else if(risk > 20) nodeColor = "#F97316"; // High Orange
                    else if(risk > 0) nodeColor = "#EAB308"; // Low Yellow

                    return{
                        id: node.id,
                        name: node.name,
                        color: nodeColor,
                        val: risk === 100 ? 5 : 3
                    };
                });

                const formattedLinks = data.raw_topology.edges.map(edge => ({
                    source: edge.source_asset_id,
                    target: edge.target_asset_id
                }));

                setGraphData({
                    nodes: formattedNodes,
                    links: formattedLinks
                });
            } catch(err){
                setError("Failed to load threat topology.");
            } finally{
                setLoading(false);
            }
        }

        fetchGraph();
    }, [id]);

    React.useEffect(() => {
        if(graphRef.current){
            graphRef.current.d3Force('charge').strength(-400);
            graphRef.current.d3Force('link').distance(100);
        }
    }, [graphData]);

    if(loading) return <div className="p-6 text-white">Calculating blast radius...</div>;
    if(error) return <div className="p-6 text-red-500">{error}</div>;

    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Threat Propagation Graph</h1>
                    <p className="text-gray-400 mt-1">Live BFS mapping from root asset #{id}</p>
                </div>
                <button 
                    onClick={() => navigate("/assets")}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                    Back to Inventory
                </button>
            </div>
            
            {/* grid: all the chilred under this be affected by grid, grid-cols-1: is the default for phone, lg:grid-cols-3: for large screen,  */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: The interactive canvas */}
                <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden h-[600px] flex items-center justify-center">
                    <ForceGraph2D 
                        ref={graphRef}
                        width={800}
                        height={600}
                        graphData={graphData}
                        nodeLabel="name"
                        nodeColor="color"
                        linkColor={() => "#4B5563"} //gray color cables
                        linkWidth={2}
                        backgroundColor="#1F2937"
                    />
                </div>

                {/* Right Side: The BFS risk analysis table */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Calculated Risk Scores</h2>
                    <div className="space-y-4">
                        {threatData.map((threat) => (
                            <div key={threat.asset_id} className="p-3 bg-gray-900 border border-gray-700 rounded">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-200">{threat.name}</span>
                                    <span className={`text-sm font-bold ${
                                        threat.risk_score === 100 ? 'text-red-500' : 
                                        threat.risk_score > 20 ? 'text-orange-500' : 'text-yellow-500'
                                    }`}>
                                        {threat.risk_score}%
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>Asset #{threat.asset_id}</span>
                                    <span>Distance: {threat.depth} hop(s)</span>
                                </div>

                                {/* visual progree bar */}
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                    <div 
                                        className="bg-current h-1.5 rounded-full"
                                        style={{
                                            width: `${threat.risk_score}%`,
                                            color: threat.risk_score === 100 ? '#EF4444' : threat.risk_score > 20 ? '#F97316' : '#EAB308'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThreatGraph;

