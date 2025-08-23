import React, { useEffect, useState } from "react";
import "./TrackOrders.css"; // Import the new CSS file

const API_URL = "https://threebapi-1067354145699.asia-south1.run.app/api/transfers/all";

const statusStyles = {
  LOADING: { background: "#ffc107", name: "Loading" },
  COMPLETED: { background: "#198754", name: "Completed" },
  OUT_FOR_DELIVERY: { background: "#0dcaf0", name: "Out for Delivery" },
  DEFAULT: { background: "#6c757d", name: "Unknown" },
};

// --- Reusable SVG Icons ---
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l4-4-4-4"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ChevronIcon = ({ isOpen }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);


// --- Reusable Loader Component ---
const Loader = () => (
  <div className="loaderContainer">
    <div className="loader"></div>
    <p>Fetching latest updates...</p>
  </div>
);

// --- Accordion Section Component ---
const DetailsSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="detailsSection">
      <div className="detailsHeader" onClick={() => setIsOpen(!isOpen)}>
        <h4>{icon}{title}</h4>
        <ChevronIcon isOpen={isOpen} />
      </div>
      <div className={`detailsContent ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};


// --- Main Card Component for a Single Order ---
const OrderCard = ({ order }) => {
  const statusInfo = statusStyles[order.status] || statusStyles.DEFAULT;

  return (
    <div className="orderCard">
      <div className="cardMainInfo">
        <img
          src={order.productId.images?.[0]?.url || 'https://via.placeholder.com/150'}
          alt={order.productId.name}
          className="productImg"
        />
        <div style={{ flex: 1 }}>
          <h3>{order.productId.name}</h3>
          <p className="locationInfo">
            {order.startPoint} → {order.endPoint}
          </p>
          <span className="statusBadge" style={{ background: statusInfo.background }}>
            {statusInfo.name}
          </span>
        </div>
      </div>

      <DetailsSection title="Truck Details" icon={<TruckIcon />}>
        <ul className="detailsList">
          <li><b>Vehicle No:</b> {order.vehicleNumber}</li>
          <li><b>Driver:</b> {order.driverName}</li>
          <li><b>Boxes:</b> {order.numberOfBoxes}</li>
          <li><b>Loading Time:</b> {new Date(order.loadingTimestamp).toLocaleString()}</li>
          <li><b>Unloading Time:</b> {order.unloadingTimestamp ? new Date(order.unloadingTimestamp).toLocaleString() : "In Transit"}</li>
          <li>
            <b>Damaged Boxes:</b>{" "}
            {order.damagedBoxCount > 0 ? `${order.damagedBoxCount} (${order.damagedBoxIds.join(", ")})` : "None reported"}
          </li>
        </ul>
      </DetailsSection>

      <DetailsSection title="Helper Details" icon={<UserIcon />}>
        <ul className="detailsList">
          <li><b>Name:</b> {order.staffEmployeeId?.name}</li>
          <li><b>Role:</b> {order.staffEmployeeId?.role}</li>
          <li><b>Employee ID:</b> {order.staffEmployeeId?.eid}</li>
        </ul>
      </DetailsSection>

      <DetailsSection title="Status History" icon={<HistoryIcon />}>
        <div className="timeline">
          {order.statusHistory.map((s, idx) => (
            <div key={idx} className={`timelineItem ${idx === 0 ? 'active' : ''}`}>
              <div className="timelineDot" style={{ backgroundColor: (statusStyles[s.status] || statusStyles.DEFAULT).background }}></div>
              <div className="timelineContent">
                <span className="status" style={{ color: (statusStyles[s.status] || statusStyles.DEFAULT).background }}>
                  {(statusStyles[s.status] || statusStyles.DEFAULT).name}
                </span>
                <span className="timestamp">{new Date(s.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </DetailsSection>
    </div>
  );
};


// --- Main Component ---
const TrackOrders = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Sort by latest status update first
        const sortedData = data.sort((a, b) => new Date(b.statusHistory[0]?.timestamp) - new Date(a.statusHistory[0]?.timestamp));
        setOrders(sortedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="trackOrdersOverlay">
      <header className="trackOrdersHeader">
        <h2>🚚 Track Shipments</h2>
        <button className="trackOrdersCloseBtn" onClick={onClose}>×</button>
      </header>
      <main className="trackOrdersContent">
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <p>No active shipments found.</p>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </main>
    </div>
  );
};

export default TrackOrders;