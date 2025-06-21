import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";
import { RiGitForkFill, RiSearchLine } from "react-icons/ri";
import TopologyGraphComponent from "../components/TopologyGraphComponent";

const TopologiPage = () => {
  const [uplinkList, setUplinkList] = useState([]);
  const [selectedUplink, setSelectedUplink] = useState("");
  const [topologyData, setTopologyData] = useState(null);
  const [oltReference, setOltReference] = useState([]);
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
    // 1. Ambil data topologi internal
    const topoRes = await axios.get(
      `${API_URL}/topologi/uplink-to-olt?uplink=${uplink}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Topology data response:", topoRes.data);
    setTopologyData({
      uplink: topoRes.data.uplink,
      data: topoRes.data.devices,
    });

    // 2. Ambil OLT referensi dari API eksternal via proxy
    const refRes = await axios.get(`${API_URL}/proxy/olt-monitoring`);
    setOltReference(refRes.data || []);
  } catch (err) {
    console.error("Error fetching topology or OLT reference via proxy:", err);
    setError("Error fetching topology or OLT reference via API NISA");
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

  // Komponen Legend yang sudah diperbaiki
  const Legend = () => {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">Legend</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Node Legend */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-gray-600 uppercase tracking-wide">
              Nodes
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">BNG</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">OLT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">OLT Cascade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">OLT Offline</span>
              </div>
            </div>
          </div>

          {/* Edge Legend */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-gray-600 uppercase tracking-wide">
              Connections
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Mainlink</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 border-t border-dashed border-gray-600"></div>
                <span className="text-xs text-gray-600">Backuplink</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <RiGitForkFill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Network Topology
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          {/* Control Panel */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Topology View
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select an uplink to view network topology
                  </p>
                </div>
              </div>

              {/* Uplink Selector */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiSearchLine className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="uplink"
                    id="uplink"
                    className="block w-64 pl-9 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm appearance-none cursor-pointer"
                    value={selectedUplink}
                    onChange={(e) => setSelectedUplink(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select Uplink...</option>
                    {!loading &&
                      uplinkList &&
                      uplinkList.length > 0 &&
                      uplinkList.map((item, index) => (
                        <option key={index} value={item.uplink}>
                          {item.uplink}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm">Loading uplinks...</p>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Legend Sidebar */}
              <div className="flex-shrink-0 w-64 p-4 border-r border-gray-100">
                <Legend />
              </div>

              {/* Topology Graph Main Area */}
              <div className="flex-1 flex flex-col">
                {/* Graph Header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedUplink
                        ? `Topology: ${selectedUplink}`
                        : "Network Topology"}
                    </h3>
                    {loadingTopology && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Graph Content */}
                <div className="flex-1 p-6 overflow-hidden">
                  {loadingTopology ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">
                          Loading topology data...
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Please wait while we fetch the network topology
                        </p>
                      </div>
                    </div>
                  ) : selectedUplink &&
                    topologyData &&
                    topologyData.data &&
                    topologyData.data.length > 0 ? (
                    <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden">
                      <TopologyGraphComponent
                        uplink={topologyData.uplink}
                        data={topologyData.data}
                        oltReference={oltReference}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
                      <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <RiGitForkFill className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {selectedUplink
                            ? "No Topology Data"
                            : "Select an Uplink"}
                        </h4>
                        <p className="text-gray-500">
                          {selectedUplink
                            ? "No topology data available for the selected uplink"
                            : "Choose an uplink from the dropdown to visualize the network topology"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopologiPage;
