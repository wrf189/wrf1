import React from "react";

const TableOlt = ({ dataOlt }) => {
  console.log("dataOlt:", dataOlt);

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                No
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Hostname
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                % Utilization
              </th>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {Array.isArray(dataOlt?.data) && dataOlt.data.length > 0 ? (
              dataOlt.data.map((olt, index) => {
                const utilization = parseInt(olt.precent_util_olt);
                const isOverUtilized = utilization >= 100;

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font text-gray-900 uppercase">
                        {olt.hostname}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                        {olt.type_link}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${
                          utilization >= 100 ? 'text-red-600' : 
                          utilization >= 80 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {utilization}%
                        </span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              utilization >= 100 ? 'bg-red-500' : 
                              utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${
                          isOverUtilized
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          isOverUtilized ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        {isOverUtilized ? "Overutilized" : "Congest"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">No OLT data found</p>
                      <p className="text-xs text-gray-400 mt-1">Data will appear here when available</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOlt;