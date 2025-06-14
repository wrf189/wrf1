import express from "express";
import axios from "axios";
import FormData from "form-data";
import https from "https";

const router = express.Router();
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

router.get("/olt-monitoring", async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("username", "wangsa.fatahillah");
    formData.append("password", "e0c9fcfd8400dd6898379e977292047b");

    const loginRes = await axios.post(
      "https://apicore.oss.myrepublic.co.id/authenticate/login",
      formData,
      {
        headers: formData.getHeaders(),
        httpsAgent,
      }
    );

    const token = loginRes.data?.data?.access_token;
    if (!token) {
      return res.status(401).json({ error: "Login token not found" });
    }

    const oltRes = await axios.get(
      "https://apinisa.oss.myrepublic.co.id/api/referential/datalink/olt",
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent,
      }
    );

    res.json(oltRes.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: "Failed to fetch OLT data" });
  }
});

export default router;