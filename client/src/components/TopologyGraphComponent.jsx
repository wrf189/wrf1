import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import PortInfoMod from "../mods/PortInfoMod";

const TopologyGraphComponent = ({ uplink, data, oltReference }) => {
  const containerRef = useRef(null);
  const [popupData, setPopupData] = useState(null);
  const [duplicateHostnames, setDuplicateHostnames] = useState([]);
  const [utilizationTooltip, setUtilizationTooltip] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Hitung jumlah hostname (pakai trim + lowercase agar konsisten)
    const hostnameCount = {};
    data.forEach((d) => {
      const rawHostname = d.hostname;
      if (!rawHostname) return;
      const hostname = rawHostname.trim().toLowerCase();
      hostnameCount[hostname] = (hostnameCount[hostname] || 0) + 1;
    });

    const duplicates = Object.entries(hostnameCount)
      .filter(([_, count]) => count > 1)
      .map(([hostname]) => hostname);

    setDuplicateHostnames(duplicates);
    console.log("Detected duplicate hostnames:", duplicates);
  }, [data]);

  // Function to get utilization data for a hostname
  const getUtilizationData = (hostname) => {
    if (!hostname || !oltReference?.data) return null;
    
    const normalizedHostname = hostname.trim().toLowerCase();
    const infoFromOlt = oltReference.data.find(
      (item) => item.hostname?.trim().toLowerCase() === normalizedHostname
    );
    
    return infoFromOlt ? {
      percentage: infoFromOlt.precent_util_olt,
      isCongest: infoFromOlt.precent_util_olt > 80 // Threshold bisa disesuaikan
    } : null;
  };

  // Function to create node label with utilization
  const createNodeLabel = (device, utilData) => {
    const baseLabel = `${device.devicename || "Unknown"}\n(${device.hostname || "-"})`;
    
    if (utilData) {
      return `${baseLabel}\n📊 ${utilData.percentage}%`;
    }
    
    return baseLabel;
  };

  // Function to get node color based on original status (tidak berubah berdasarkan utilization)
  const getNodeColor = (device) => {
    // Tetap gunakan warna original berdasarkan status
    return device.status === "online" ? "#28a745" : "#dc3545";
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const mainUplinkNodeId = "uplink";

    const nodes = [
      {
        id: mainUplinkNodeId,
        label: uplink,
        shape: "box",
        color: "#007bff",
        font: { color: "#fff", size: 16, bold: true },
        margin: 10,
        level: 0,
      },
      ...data.map((device) => {
        const utilData = getUtilizationData(device.hostname);
        
        return {
          id: device.id,
          label: createNodeLabel(device, utilData),
          shape: "ellipse",
          color: getNodeColor(device),
          font: { color: "#fff", size: utilData ? 12 : 14 },
          margin: 15,
          level: 1,
          utilization: utilData, // Store utilization data for tooltip
        };
      }),
      ...data.flatMap((device) =>
        Array.isArray(device.subDevices)
          ? device.subDevices.map((sub) => {
              const utilData = getUtilizationData(sub.hostname);
              
              return {
                id: sub.id,
                label: utilData 
                  ? `${sub.subdevicename || "SubDevice"}\n ${sub.hostname || "-"}\n📊 ${utilData.percentage}%`
                  : `${sub.subdevicename || "SubDevice"}\n ${sub.hostname || "-"}`,
                shape: "ellipse",
                color: "#ffc107", // Tetap warna original untuk subdevice
                font: { size: 12 },
                level: 2,
                utilization: utilData,
              };
            })
          : []
      ),
    ];

    const edges = data.flatMap((device) => {
      const baseEdge = {
        id: `main-${device.id}`,
        from: mainUplinkNodeId,
        to: device.id,
        color: { color: "#999" },
        font: { align: "middle" },
        dashes: false,
        smooth: {
          type: "curvedCW",
          roundness: 0.1,
        },
        data: {
          portuplink: device.portuplink,
          portdevicename: device.portdevicename,
          type: "main",
        },
      };

      let backupEdge = null;

      if (device.backuplink === "YES") {
        if (device.backupType === "device" && device.backupTarget) {
          backupEdge = {
            id: `backup-${device.id}`,
            from: device.id,
            to: device.backupTarget.id,
            color: { color: "#f39c12" },
            dashes: true,
            smooth: {
              type: "curvedCCW",
              roundness: 0.2,
            },
            data: {
              portuplink: device.portuplink_backup,
              portdevicename: device.portdevicename_backup,
              type: "backup",
            },
          };
        } else if (
          device.backupType === "uplink" &&
          device.portuplink_backup &&
          device.portdevicename_backup
        ) {
          backupEdge = {
            id: `backup-${device.id}`,
            from: mainUplinkNodeId,
            to: device.id,
            color: { color: "#f39c12" },
            dashes: true,
            smooth: {
              type: "curvedCCW",
              roundness: 0.2,
            },
            data: {
              portuplink: device.portuplink_backup,
              portdevicename: device.portdevicename_backup,
              type: "backup",
            },
          };
        }
      }

      const subDeviceEdges = Array.isArray(device.subDevices)
        ? device.subDevices.map((sub) => ({
            id: `sub-${sub.id}`,
            from: device.id,
            to: sub.id,
            color: { color: "#999" },
            font: { align: "middle" },
            dashes: false,
            smooth: {
              type: "curvedCW",
              roundness: 0.15,
            },
            data: {
              portdevice: sub.portdevice,
              portsubdevice: sub.portsubdevice,
              type: "sub",
            },
          }))
        : [];

      return backupEdge
        ? [baseEdge, backupEdge, ...subDeviceEdges]
        : [baseEdge, ...subDeviceEdges];
    });

    const options = {
      nodes: {
        borderWidth: 2,
        size: 35, // Slightly larger to accommodate utilization text
        font: { size: 14 },
        shapeProperties: { borderDashes: false },
      },
      edges: {
        smooth: {
          type: "cubicBezier",
          forceDirection: "vertical",
          roundness: 0.2,
        },
        hoverWidth: 2,
        selectionWidth: 3,
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          levelSeparation: 180, // Increased spacing for better readability
          nodeSpacing: 250,
          treeSpacing: 250,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          shakeTowards: "roots",
        },
      },
      physics: {
        enabled: false,
      },
      height: "100%",
      width: "100%",
    };

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );

    // Enhanced hover event for utilization tooltip
    network.on("hoverNode", (params) => {
      const nodeId = params.node;
      const node = nodes.find(n => n.id === nodeId);
      
      if (node && node.utilization && params.pointer?.DOM) {
        setUtilizationTooltip({
          x: params.pointer.DOM.x,
          y: params.pointer.DOM.y,
          utilization: node.utilization,
          hostname: node.id === mainUplinkNodeId ? uplink : 
            data.find(d => d.id === nodeId)?.hostname || 
            data.flatMap(d => d.subDevices || []).find(s => s.id === nodeId)?.hostname
        });
      }
    });

    network.on("blurNode", () => {
      setUtilizationTooltip(null);
    });

    network.on("click", (params) => {
      if (params.edges.length > 0) {
        const clickedEdgeId = params.edges[0];
        const clickedEdge = edges.find((e) => e.id === clickedEdgeId);

        const clickedDeviceId =
          clickedEdge.from === "uplink" ? clickedEdge.to : clickedEdge.from;
        const clickedDevice = data.find((d) => d.id === clickedDeviceId);

        if (clickedEdge?.data && params.pointer?.DOM) {
          setPopupData({
            x: params.pointer.DOM.x,
            y: params.pointer.DOM.y,
            portUplink:
              clickedEdge.data.portuplink || clickedEdge.data.portdevice,
            portDevice:
              clickedEdge.data.portdevicename || clickedEdge.data.portsubdevice,
            type: clickedEdge.data.type,
            hostname: clickedDevice?.hostname?.trim().toLowerCase() || "",
          });
        }
      } else {
        setPopupData(null);
      }
    });

    setTimeout(() => {
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad",
        },
      });
    }, 500);

    window.addEventListener("resize", () => network.fit());
    return () => {
      network.destroy();
      window.removeEventListener("resize", () => network.fit());
    };
  }, [uplink, data, oltReference]);

      return (
    <div className="relative w-full h-full border border-gray-300 rounded-md">
      <div ref={containerRef} className="w-full h-full" />

      {/* Utilization Tooltip */}
      {utilizationTooltip && (
        <div
          className="absolute bg-black bg-opacity-80 text-white text-sm rounded-md p-2 z-50 pointer-events-none"
          style={{ 
            top: utilizationTooltip.y - 40, 
            left: utilizationTooltip.x - 50,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold text-xs">{utilizationTooltip.hostname}</div>
          <div className={`font-semibold ${
            utilizationTooltip.utilization.percentage >= 100 ? 'text-red-400 text-xs' :
            utilizationTooltip.utilization.percentage >= 80 ? 'text-orange-400 text-xs' :
            'text-green-400'
          }`}>
            📊 {utilizationTooltip.utilization.percentage}% Utilization
          </div>
          {utilizationTooltip.utilization.isCongest && (
            <div className="text-red-400 text-xs">⚠️ Congested</div>
          )}
        </div>
      )}

      {/* Port Info Popup */}
      {popupData && (
        <PortInfoMod
          x={popupData.x}
          y={popupData.y}
          portUplink={popupData.portUplink}
          portDevice={popupData.portDevice}
          type={popupData.type}
          hostname={popupData.hostname}
          oltReference={oltReference}
          duplicateHostnames={duplicateHostnames}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default TopologyGraphComponent;