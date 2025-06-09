const PortInfoMod = ({ x, y, portUplink, portDevice, type, onClose }) => {
  return (
    <div
      className="absolute bg-white border border-gray-400 rounded-md shadow-lg p-4 z-50 text-sm"
      style={{ top: y, left: x }}
    >
      <div className="font-semibold mb-2">
        Port Info {type === "backup" ? "(Backup)" : ""}
      </div>
      <div>
        <strong>Port Uplink:</strong> {portUplink}
      </div>
      <div>
        <strong>Port Device:</strong> {portDevice}
      </div>
      <button
        onClick={onClose}
        className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );
};

export default PortInfoMod;