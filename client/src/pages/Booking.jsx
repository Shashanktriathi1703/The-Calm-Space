import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import BookingIllustration from "../components/BookingIllustration.jsx";
import "../styles/booking.css";

const STEPS = ["Choose Time", "Your Details", "Payment", "Confirmation"];

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function Calendar({ selectedDate, onSelect }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={year === today.getFullYear() && month === today.getMonth()}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span>{monthLabel}</span>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((date, i) => {
          if (!date) return <span key={i} className="calendar-cell empty" />;
          const isPast = date < today;
          const isSunday = date.getDay() === 0;
          const disabled = isPast || isSunday;
          const iso = toISODate(date);
          const isSelected = selectedDate === iso;
          return (
            <button
              type="button"
              key={i}
              className={`calendar-cell ${isSelected ? "selected" : ""}`}
              disabled={disabled}
              onClick={() => onSelect(iso)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const [step, setStep] = useState(0);

  // Step 1
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState(null);

  // Step 2
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sessionType: "Individual Counselling",
    reasonForVisit: "",
    notes: "",
  });

  // Step 3 / payment
  const [amount, setAmount] = useState(1500);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // Step 4
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!date) return;
    setSlotsLoading(true);
    setTimeSlot(null);
    api
      .get("/bookings/slots", { params: { date } })
      .then((res) => setSlots(res.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [date]);

  const updateDetail = (field) => (e) =>
    setDetails((d) => ({ ...d, [field]: e.target.value }));

  const goToDetails = () => {
    if (date && timeSlot) setStep(1);
  };

  const goToPayment = (e) => {
    e.preventDefault();
    if (!details.name || !details.email || !details.phone) return;
    setStep(2);
  };

  const startPayment = async () => {
    setPaying(true);
    setPayError("");
    try {
      const { data } = await api.post("/bookings/create-order", { date, timeSlot });
      setAmount(data.amount);

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Dr. Kanchan Shukla Pandey",
        description: `${details.sessionType} — ${date} ${timeSlot}`,
        order_id: data.order.id,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },
        theme: { color: "#1F3D36" },
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/bookings/verify-and-book", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              details: {
                ...details,
                age: details.age ? Number(details.age) : undefined,
              },
              date,
              timeSlot,
              amount: data.amount,
            });
            setConfirmedBooking(verifyRes.data.booking);
            setStep(3);
          } catch (err) {
            setPayError(
              err?.response?.data?.error || "We couldn't confirm your booking after payment. Please contact us with your payment ID."
            );
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on("payment.failed", () => {
        setPayError("Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      setPayError(err?.response?.data?.error || "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  return (
    <section className="booking-section">
      <div className="container booking-header-grid">
        <div>
          <span className="eyebrow reveal" style={{ "--d": "0s" }}>Book a Session</span>
          <h1 className="reveal" style={{ "--d": "0.06s" }}>Select a time that works for you</h1>
          <p className="booking-sub reveal" style={{ "--d": "0.12s" }}>Online sessions, 60 minutes. No login required.</p>
        </div>
        <div className="booking-header-visual reveal" style={{ "--d": "0.15s" }}>
          <BookingIllustration />
        </div>
      </div>

      <div className="container">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`stepper-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <span className="stepper-index">{i + 1}</span>
              <span className="stepper-label">{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 0 && (
          <div className="step-panel choose-time-grid">
            <Calendar selectedDate={date} onSelect={setDate} />
            <div className="slots-panel">
              <h3>{date ? `Available slots for ${date}` : "Pick a date"}</h3>
              {!date && <p className="slots-empty">Choose a date from the calendar to see open times.</p>}
              {date && slotsLoading && <p className="slots-empty">Loading slots…</p>}
              {date && !slotsLoading && slots.length === 0 && (
                <p className="slots-empty">No slots available for this date. Try another date.</p>
              )}
              {date && !slotsLoading && slots.length > 0 && (
                <div className="slot-list">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className={`slot-btn ${timeSlot === s ? "selected" : ""}`}
                      onClick={() => setTimeSlot(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <button className="btn btn-primary btn-full" disabled={!date || !timeSlot} onClick={goToDetails}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <form className="step-panel details-panel" onSubmit={goToPayment}>
            <div className="selected-slot-banner">
              Selected: <strong>{date}</strong> · <strong>{timeSlot}</strong>{" "}
              <button type="button" className="link-btn" onClick={() => setStep(0)}>
                Change
              </button>
            </div>

            <div className="form-row">
              <label>
                Full name
                <input required value={details.name} onChange={updateDetail("name")} />
              </label>
              <label>
                Email
                <input required type="email" value={details.email} onChange={updateDetail("email")} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone
                <input required value={details.phone} onChange={updateDetail("phone")} placeholder="+91 ..." />
              </label>
              <label>
                Age (optional)
                <input type="number" min="0" value={details.age} onChange={updateDetail("age")} />
              </label>
            </div>
            <label>
              Session type
              <select value={details.sessionType} onChange={updateDetail("sessionType")}>
                <option>Individual Counselling</option>
                <option>Career Counselling</option>
                <option>Follow-up Session</option>
              </select>
            </label>
            <label>
              What brings you here? (optional)
              <textarea rows={3} value={details.reasonForVisit} onChange={updateDetail("reasonForVisit")} />
            </label>
            <label>
              Anything else you'd like me to know? (optional)
              <textarea rows={2} value={details.notes} onChange={updateDetail("notes")} />
            </label>

            <button className="btn btn-primary btn-full" type="submit">
              Continue to Payment
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="step-panel payment-panel">
            <div className="selected-slot-banner">
              Selected: <strong>{date}</strong> · <strong>{timeSlot}</strong>{" "}
              <button type="button" className="link-btn" onClick={() => setStep(1)}>
                Change
              </button>
            </div>
            <div className="payment-summary">
              <div>
                <span>Session type</span>
                <strong>{details.sessionType}</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>60 minutes</strong>
              </div>
              <div className="payment-total">
                <span>Total</span>
                <strong>₹{amount}</strong>
              </div>
            </div>
            <p className="payment-note">
              Secure payment via Razorpay (UPI, card, or netbanking). You'll get an email
              confirmation immediately after payment.
            </p>
            {payError && <p className="form-note form-note-error">{payError}</p>}
            <button className="btn btn-primary btn-full" onClick={startPayment} disabled={paying}>
              {paying ? "Processing…" : `Pay ₹${amount} & Confirm`}
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 3 && confirmedBooking && (
          <div className="step-panel confirmation-panel">
            <div className="confirmation-check">✓</div>
            <h2>You're booked, {confirmedBooking.name.split(" ")[0]}.</h2>
            <p>A confirmation email is on its way to {confirmedBooking.email}.</p>
            <div className="confirmation-details">
              <div>
                <span>Session</span>
                <strong>{confirmedBooking.sessionType}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{confirmedBooking.date}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{confirmedBooking.timeSlot}</strong>
              </div>
              <div>
                <span>Amount paid</span>
                <strong>₹{confirmedBooking.amount}</strong>
              </div>
            </div>
            <p className="confirmation-footer">
              Need to reschedule? Email kanchan.s.pandey@gmail.com or call +91-8123025658.
            </p>
            <p className="confirmation-footer">
              After your session, we'd love to hear how it went —{" "}
              <Link to="/feedback" className="stories-note-link">
                share your feedback here
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
