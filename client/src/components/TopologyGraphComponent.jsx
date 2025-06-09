import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import PortInfoMod from "../mods/PortInfoMod";

const TopologyGraphComponent = ({ uplink, data }) => {
  const containerRef = useRef(null);

  console.log("Data:", data);

  const [popupData, setPopupData] = useState(null);

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
        level: 0, // Level 0 untuk uplink
      },
      // Tambahkan device node dengan level yang sama
      ...data.map((device) => ({
        id: device.id,
        label: `${device.devicename || "Unknown"}\n(${device.hostname || "-"})`,
        shape: "ellipse",
        color: device.status === "online" ? "#28a745" : "#dc3545",
        font: { color: "#fff", size: 14 },
        margin: 10,
        level: 1, // Level 1 untuk semua device agar sejajar
      })),
      // Tambahkan subdevice node (cek dulu subDevices)
      ...data.flatMap((device) =>
        Array.isArray(device.subDevices)
          ? device.subDevices.map((sub) => ({
              id: sub.id,
              label: `${sub.subdevicename || "SubDevice"}\nPort: ${
                sub.portsubdevice || "-"
              }`,
              shape: "circle",
              color: "#ffc107",
              font: { size: 12 },
              level: 2, // Level 2 untuk subdevices
            }))
          : []
      ),
    ];

    const edges = data.flatMap((device) => {
      const baseEdge = {
        id: `main-${device.id}`,
        from: mainUplinkNodeId,
        to: device.id,
        // arrows: "to",
        color: { color: "#999" },
        font: { align: "middle" },
        dashes: false,
        smooth: {
          type: "curvedCW",
          roundness: 0.1, // Kurangi roundness untuk tampilan lebih rapi
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
          // Backup edge dari device ini ke device target backup
          backupEdge = {
            id: `backup-${device.id}`,
            from: device.id,
            to: device.backupTarget.id,
            // arrows: "to",
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
          // Backup edge dari uplink ke device (seperti sebelumnya)
          backupEdge = {
            id: `backup-${device.id}`,
            from: mainUplinkNodeId,
            to: device.id,
            // arrows: "to",
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

      // Tambahkan edges dari device ke subDevices
      const subDeviceEdges = Array.isArray(device.subDevices)
        ? device.subDevices.map((sub) => ({
            id: `sub-${sub.id}`,
            from: device.id,
            to: sub.id,
            arrows: "to",
            color: { color: "#17a2b8" },
            font: { align: "middle" },
            dashes: true,
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
        size: 30,
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
          levelSeparation: 150,
          nodeSpacing: 200,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          shakeTowards: "roots"
        },
      },
      physics: {
        enabled: false, // Matikan physics untuk layout yang konsisten
      },
      height: "100%",
      width: "100%",
    };

    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );

    network.on("click", (params) => {
      if (params.edges.length > 0) {
        const clickedEdgeId = params.edges[0];
        const clickedEdge = edges.find((e) => e.id === clickedEdgeId);

        if (clickedEdge?.data && params.pointer?.DOM) {
          setPopupData({
            x: params.pointer.DOM.x,
            y: params.pointer.DOM.y,
            portUplink:
              clickedEdge.data.portuplink || clickedEdge.data.portdevice,
            portDevice:
              clickedEdge.data.portdevicename || clickedEdge.data.portsubdevice,
            type: clickedEdge.data.type,
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
  }, [uplink, data]);

  return (
    <div className="relative w-full h-full border border-gray-300 rounded-md">
      <div ref={containerRef} className="w-full h-full" />
      {popupData && (
        <PortInfoMod
          x={popupData.x}
          y={popupData.y}
          portUplink={popupData.portUplink}
          portDevice={popupData.portDevice}
          type={popupData.type}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default TopologyGraphComponent;