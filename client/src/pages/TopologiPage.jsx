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

      {/* container visjs untuk topologi */}
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
  );
};

export default TopologiPage;
