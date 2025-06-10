import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";
import TopologyGraphComponent from "../components/TopologyGraphComponent";

const TopologiPage = () => {
  const [uplinkList, setUplinkList] = useState([]);
  const [selectedUplink, setSelectedUplink] = useState("");
  const [topologyData, setTopologyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopology, setLoadingTopology] = useState(false);
  const [error, setError] = useState(null);

  const getUplinks = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/topologi/uplinks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUplinkList(response.data.uplinks);
      console.log("Uplink list:", response.data.uplinks);
    } catch (error) {
      console.error("Error fetching uplinks:", error);
      setError("Failed to fetch uplinks");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopology = async (uplink) => {
    if (!uplink) return;
    setLoadingTopology(true);
    setError(null);
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `${API_URL}/topologi/uplink-to-olt?uplink=${uplink}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Topology data response:", response.data);
      // Mengubah format data sesuai dengan yang diharapkan oleh TopologyGraphComponent
      setTopologyData({
        uplink: response.data.uplink,
        data: response.data.devices, // Menggunakan 'device' bukan 'data'
      });
    } catch (error) {
      console.error("Error fetching topology data:", error);
      setError("Failed to fetch topology data");
      setTopologyData(null);
    } finally {
      setLoadingTopology(false);
    }
  };

  useEffect(() => {
    getUplinks();
  }, []);

  useEffect(() => {
    if (selectedUplink) {
      fetchTopology(selectedUplink);
    }
  }, [selectedUplink]);

   // Komponen Legend
  const Legend = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Legend</h3>
        
        {/* Node Legend */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Node:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">BNG</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">OLT</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">OLT Cascade</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">OLT Offline</span>
            </div>
          </div>
        </div>

        {/* Edge Legend */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-700">Garis/Edge:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-gray-600"></div>
              <span className="text-sm text-gray-600">Mainlink</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-gray-600 border-dashed border-t-2 border-gray-600 bg-transparent"></div>
              <span className="text-sm text-gray-600">Backuplink</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-fit min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-bold">Management Topologi</p>

      <div className="w-full bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-5">
        <select
          name="uplink"
          id="uplink"
          className="border border-gray-300 rounded-md p-2"
          value={selectedUplink}
          onChange={(e) => setSelectedUplink(e.target.value)}
          disabled={loading}
        >
          <option value="">Pilih Uplink</option>
          {!loading &&
            uplinkList &&
            uplinkList.length > 0 &&
            uplinkList.map((item, index) => (
              <option key={index} value={item.uplink}>
                {item.uplink}
              </option>
            ))}
        </select>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Legend - akan berada di sebelah kiri pada layar besar */}
        <div className="lg:col-span-1">
          <Legend />
        </div>

        {/* container visjs untuk topologi */}
        <div className="lg:col-span-3">
          <div className="w-full h-[500px] bg-white rounded-3xl shadow-lg p-5">
            {loadingTopology ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">Loading topology data...</p>
              </div>
            ) : selectedUplink &&
              topologyData &&
              topologyData.data &&
              topologyData.data.length > 0 ? (
              <TopologyGraphComponent
                uplink={topologyData.uplink}
                data={topologyData.data}
              />
            ) : (
              <p className="text-gray-500 text-center">
                {selectedUplink
                  ? "Tidak ada data topologi untuk uplink ini"
                  : "Pilih uplink untuk melihat topologi jaringan"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologiPage;
