const PortInfoMod = ({
  x,
  y,
  portUplink,
  portDevice,
  type,
  hostname,
  oltReference,
  onClose,
}) => {
  const normalizedHostname = hostname?.trim().toLowerCase();

  // Ambil semua hostname dari data (device & subDevice)
  const allHostnames = Array.isArray(oltReference?.data)
    ? oltReference.data.flatMap((d) => {
        const hostnames = [];
        if (d.hostname) hostnames.push(d.hostname.trim().toLowerCase());
        if (Array.isArray(d.subDevices)) {
          d.subDevices.forEach((sub) => {
            if (sub.hostname) hostnames.push(sub.hostname.trim().toLowerCase());
          });
        }
        return hostnames;
      })
    : [];

  // Hitung jumlah kemunculan target hostname
  const occurrences = allHostnames.filter((h) => h === normalizedHostname).length;
  const isDuplicate = occurrences > 0;

  // Ambil data info dari hostname yang cocok
  const infoFromOlt = Array.isArray(oltReference?.data)
    ? oltReference.data.find(
        (item) =>
          item.hostname?.trim().toLowerCase() === normalizedHostname
      )
    : null;

  // Debug
  console.log("Target hostname:", normalizedHostname);
  console.log("All hostnames:", allHostnames);
  console.log("Occurrences:", occurrences);
  console.log("isDuplicate:", isDuplicate);
  console.log("infoFromOlt:", infoFromOlt);

  return (
    <div
      className="absolute bg-white border border-gray-400 rounded shadow-md p-2 z-50 text-xs min-w-[180px] max-w-[220px]"
      style={{ top: y, left: x }}
    >
      <div className="font-semibold mb-1 text-xs">
        Port Information {type === "backup" ? "(Backup)" : ""}
      </div>
      
      {/* Hostname ditambahkan */}
      {hostname && (
        <div className="mb-1">
          <strong className="text-xs">Hostname:</strong> 
          <span className="text-xs ml-1 text-blue-600 font-mono">{hostname}</span>
        </div>
      )}
      
      <div className="mb-1">
        <strong className="text-xs">Port Uplink:</strong> 
        <span className="text-xs ml-1">{portUplink}</span>
      </div>
      
      <div className="mb-1">
        <strong className="text-xs">Port Device:</strong> 
        <span className="text-xs ml-1">{portDevice}</span>
      </div>

      {isDuplicate && infoFromOlt && (
        <div className="mt-2 border-t border-gray-300 pt-1">
          <div className="text-red-600 font-semibold text-xs">
            ⚠️ <span className="underline">{infoFromOlt.precent_util_olt}%</span>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs w-full"
      >
        Close
      </button>
    </div>
  );
};

export default PortInfoMod;