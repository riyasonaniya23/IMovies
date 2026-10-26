import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

const SeatSelector = ({ bookedSeats = [], selectedSeats = [], onToggleSeat, ticketPrice, vipPrice }) => {
  return (
    <div className="text-center my-4">
      <div className="screen-curve"></div>
      <p className="text-secondary small text-uppercase tracking-wide mb-4">
        All Eyes This Way Please — Cinema Screen
      </p>

      <div className="d-inline-block p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
        {ROWS.map((row) => {
          const isVipRow = row === 'G' || row === 'H';
          return (
            <div key={row} className="d-flex align-items-center justify-content-center mb-1">
              <span className="me-3 fw-bold text-secondary" style={{ width: '24px' }}>
                {row}
              </span>
              {COLS.map((col) => {
                const seatId = `${row}${col}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let seatClass = 'seat-btn ';
                if (isBooked) seatClass += 'seat-booked';
                else if (isSelected) seatClass += 'seat-selected';
                else if (isVipRow) seatClass += 'seat-vip';
                else seatClass += 'seat-available';

                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onToggleSeat(seatId)}
                    className={`${seatClass} ${col === 4 ? 'me-4' : ''}`}
                    title={
                      isBooked
                        ? `${seatId} (Booked)`
                        : `${seatId} - ₹${isVipRow ? vipPrice : ticketPrice}`
                    }
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn seat-available d-inline-block" style={{ width: 22, height: 22 }}></span>
          <span>Regular (₹{ticketPrice})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn seat-vip d-inline-block" style={{ width: 22, height: 22 }}></span>
          <span>VIP Recliner Rows G–H (₹{vipPrice})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn seat-selected d-inline-block" style={{ width: 22, height: 22 }}></span>
          <span>Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn seat-booked d-inline-block" style={{ width: 22, height: 22 }}></span>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
