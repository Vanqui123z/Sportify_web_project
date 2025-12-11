import React from 'react';

interface BookingCalendarFieldProps {
  weekDays: Date[];
  timeSlots: string[];
  formatDate: (date: Date) => string;
  getBookingForSlot: (date: Date, timeSlot: string) => any;
  isFirstSlotOfBooking: (date: Date, timeSlot: string, booking: any) => boolean;
  getBookingSpan: (booking: any, date: Date) => number;
  handleSlotClick: (date: Date, timeSlot: string) => void;
}

const BookingCalendarField: React.FC<BookingCalendarFieldProps> = ({
  weekDays,
  timeSlots,
  formatDate,
  getBookingForSlot,
  isFirstSlotOfBooking,
  getBookingSpan,
  handleSlotClick,
}) => {
  return (
    <table className="calendar-table">
      <thead>
        <tr>
          <th className="time-header"></th>
          {timeSlots.map(slot => (
            <th key={slot} className="time-slot-header">
              {slot.split('-')[0]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weekDays.map((day, dayIndex) => (
          <tr key={dayIndex}>
            <td className="day-header">
              {formatDate(day)}
            </td>
            {timeSlots.map((slot, slotIndex) => {
              const booking = getBookingForSlot(day, slot);
              if (booking && isFirstSlotOfBooking(day, slot, booking)) {
                const span = getBookingSpan(booking, day);
                return (
                  <td
                    key={`${dayIndex}-${slotIndex}`}
                    className={`time-slot `}
                    colSpan={span}
                    onClick={() => handleSlotClick(day, slot)}
                    title={`${booking.title} - ${booking.shiftName}`}
                    style={{ position: 'relative' }}
                  >
                    <div className="booking-label" style={{ position: 'relative' }}>
                      {booking.bookingStatus && (
                        <div
                          className={`ribbon-position ribbon-shape ${booking.bookingStatus === 'Đã Cọc' ? 'ribbon-dacoc' :
                            booking.bookingStatus === 'Hoàn Thành' ? 'ribbon-hoanthanh' :
                              'ribbon-dahuy'
                            }`}
                        >
                        </div>
                      )}
                      <div className={`booking-tag ${booking.type === 'PERMANENT' ? 'permanent' : booking.type === 'ONCE' ? 'once' : 'temporary'}`}>
                        {booking.customerName && <div style={{ fontSize: '0.7em', marginTop: '2px' }}>{booking.customerName}</div>}
                        {booking.customerPhone && <div style={{ fontSize: '0.7em', marginTop: '1px' }}>{booking.customerPhone}</div>}
                      </div>
                    </div>
                  </td>
                );
              }
              if (booking && !isFirstSlotOfBooking(day, slot, booking)) {
                return null;
              }
              return (
                <td
                  key={`${dayIndex}-${slotIndex}`}
                  className="time-slot available"
                  onClick={() => handleSlotClick(day, slot)}
                  title="Trống"
                >
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingCalendarField;
