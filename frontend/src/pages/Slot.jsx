import { useEffect, useState } from "react";
import { listTherapists, listSlots, createSlot } from "../api";
import { createBooking, deleteSlot } from "../api"; // deleteSlot works if you add a DELETE route later

const toISO = (v) => (v ? new Date(v).toISOString() : "");

export default function Slots() {
  const [therapists, setTherapists] = useState([]);
  const [sel, setSel] = useState("");
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ start: "", end: "" });
  const [msg, setMsg] = useState("");

  const loadTherapists = async () => setTherapists(await listTherapists());
  const loadSlots = async () =>
    sel
      ? setSlots(await listSlots({ therapistId: sel, onlyOpen: "true" }))
      : setSlots([]);

  useEffect(() => {
    loadTherapists();
  }, []);
  useEffect(() => {
    loadSlots();
  }, [sel]);

  const add = async (e) => {
    e.preventDefault();
    if (!sel) return setMsg("Choose therapist");
    if (!form.start || !form.end) return setMsg("Start and end required");
    try {
      await createSlot({
        therapistId: sel,
        start: toISO(form.start),
        end: toISO(form.end),
      });
      setForm({ start: "", end: "" });
      setMsg("Slot created");
      loadSlots();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const book = async (s) => {
    try {
      await createBooking({
        therapistId: s.therapist,
        slotId: s._id,
        notes: "",
      });
      setMsg("Booked");
      loadSlots();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const ask = (m) =>
    typeof window !== "undefined" ? window.confirm(m) : false;
  const remove = async (id) => {
    if (!ask("Delete slot?")) return;
    try {
      await deleteSlot(id);
      setMsg("Slot deleted");
      loadSlots();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Slots</h2>
      {msg && (
        <div style={{ background: "#eef", padding: 8, margin: "8px 0" }}>
          {msg}
        </div>
      )}

      <label>Therapist: </label>
      <select
        value={sel}
        onChange={(e) => setSel(e.target.value)}
        style={{ marginBottom: 12 }}
      >
        <option value="">-- choose --</option>
        {therapists.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name} (${t.rate})
          </option>
        ))}
      </select>

      {/* Create slot */}
      <form
        onSubmit={add}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          type="datetime-local"
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.end}
          onChange={(e) => setForm({ ...form, end: e.target.value })}
        />
        <button>Add Slot</button>
      </form>

      {/* List + actions */}
      {!sel ? (
        <p>Select therapist to see open slots</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s._id} style={{ borderTop: "1px solid #eee" }}>
                <td>{new Date(s.start).toLocaleString()}</td>
                <td align="center">{new Date(s.end).toLocaleTimeString()}</td>
                <td align="right" style={{ whiteSpace: "nowrap" }}>
                  <button onClick={() => book(s)}>Book</button>{" "}
                  <button
                    onClick={() => remove(s._id)}
                    style={{ color: "crimson" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan="3">No open slots</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
