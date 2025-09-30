import { useEffect, useState } from "react";
import { myBookings, cancelBooking } from "../api";

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const load = async () => {
    try {
      setItems(await myBookings());
    } catch (e) {
      setMsg(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const ask = (m) =>
    typeof window !== "undefined" ? window.confirm(m) : false;
  const cancel = async (id) => {
    if (!ask("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      setMsg("Canceled");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>My Bookings</h2>
      {msg && (
        <div style={{ background: "#eef", padding: 8, margin: "8px 0" }}>
          {msg}
        </div>
      )}

      {items.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((b) => (
            <div
              key={b._id}
              style={{
                border: "1px solid #eee",
                padding: 8,
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div>
                  <b>{b.therapist?.name || b.therapist}</b>
                </div>
                <div>
                  {b.slot && new Date(b.slot.start).toLocaleString()} —{" "}
                  {b.status}
                </div>
              </div>
              <button
                onClick={() => cancel(b._id)}
                style={{ color: "crimson" }}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
