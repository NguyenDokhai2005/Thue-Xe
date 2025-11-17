import { useEffect, useState } from 'react';
import { bookingApi, vehicleApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, PlayCircle, XCircle, Plus } from 'lucide-react';
import type { Booking, Vehicle, BookingStatus } from '../types';
import { format } from 'date-fns';
import BookingModal from '../components/BookingModal';

const Bookings = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsData, vehiclesData] = await Promise.all([
        bookingApi.getMyBookings(),
        vehicleApi.list(),
      ]);
      setBookings(bookingsData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleStatusChange = async (id: number, action: 'confirm' | 'activate' | 'complete' | 'cancel') => {
    try {
      switch (action) {
        case 'confirm':
          await bookingApi.confirm(id);
          break;
        case 'activate':
          await bookingApi.activate(id);
          break;
        case 'complete':
          await bookingApi.complete(id);
          break;
        case 'cancel':
          await bookingApi.cancel(id);
          break;
      }
      fetchData();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredBookings = filterStatus === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const statusLabels: Record<BookingStatus, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    ACTIVE: 'Đang thuê',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    REFUNDED: 'Đã hoàn tiền',
  };

  const statusColors: Record<BookingStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đặt xe</h1>
          <p className="text-gray-600 mt-2">Danh sách và quản lý các đặt xe</p>
        </div>
        {!isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Đặt xe mới</span>
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BookingStatus | 'ALL')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chưa có đặt xe nào
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.vehicleTitle}</div>
                      <div className="text-sm text-gray-500">{booking.vehicleType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(booking.startAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(booking.endAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.totalAmount.toLocaleString('vi-VN')} {booking.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {isAdmin && booking.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirm')}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            title="Xác nhận"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Xác nhận</span>
                          </button>
                        )}
                        {isAdmin && booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'activate')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                            title="Kích hoạt"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Kích hoạt</span>
                          </button>
                        )}
                        {isAdmin && booking.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'complete')}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                            title="Hoàn thành"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Hoàn thành</span>
                          </button>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancel')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                            title="Hủy"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Hủy</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <BookingModal
          vehicles={vehicles.filter(v => v.status === 'AVAILABLE')}
          onClose={() => setShowModal(false)}
          onSave={async () => {
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Bookings;

