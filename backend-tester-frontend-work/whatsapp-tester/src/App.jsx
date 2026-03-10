import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("qr", (data) => setQr(data));
    socket.on("status", (data) => setStatus(data.message));
  }, []);

  const sendMessage = async () => {
    try {
      await axios.post("http://localhost:3000/api/whatsapp/send", { number, message });
      alert("Message Sent Successfully!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to send"));
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <img src="https://lh3.googleusercontent.com/proxy/PD8zj7EtFTN8SolNYPU82ufSMD061tqDjIut6wmvQW3VkQhrbxH-Jpr01yhfZCE_5zDlDBeG229Iqfk_C_zuI47w9zNJn1POGJ1Vni1mvvqH35TKhezReR2dH7uO" alt="Logo" style={{ width: "40%" }} />
        </div>
        
        {/* Status Indicator */}
        {/* Modern Status Indicator */}
<div className="status-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '15px 0' }}>
  <img 
    src={status === "WhatsApp is Ready" 
      ? "https://png.pngtree.com/png-clipart/20230924/original/pngtree-rounded-wifi-icon-in-black-mobile-computer-spot-vector-png-image_12582204.png" 
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZTfeZyVr7GyW1ygsIqMmADllxP3iwG1h6gw&s"} 
    alt="Status Icon" 
    style={{ width: '20px', height: '20px' }} 
  />
  <span className="status-text" style={{ fontWeight: 'bold' }}>
    {status === "WhatsApp is Ready" ? "Online" : "Offline"}
  </span>
</div>

        {qr && <img src={qr} alt="Scan QR" className="qr-code" />}

        <div className="form">
          <div className="input-group">
            <label>Phone Number</label>
            <input placeholder="e.g. 923xxxxxxxxx" onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Message</label>
            <textarea placeholder="Type your message here..." onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className="send-btn" onClick={sendMessage}>Send Message 💬</button>
        </div>
      </div>
    </div>
  );
}
export default App;