import { useState } from 'react';
import { X } from 'lucide-react';
import { bookingApi } from '../services/api';
import type { Vehicle, BookingCreateRequest } from '../types';

interface BookingModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onSave: () => void;
}

const BookingModal = ({ vehicles, onClose, onSave }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingCreateRequest>({
    vehicleId: vehicles[0]?.id || 0,
    startAt: '',
    endAt: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert local datetime to ISO format
      const startAt = new Date(formData.startAt).toISOString();
      const endAt = new Date(formData.endAt).toISOString();

      await bookingApi.create({
        ...formData,
        startAt,
        endAt,
      });
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Tạo đặt xe thất bại');
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
  const startDate = formData.startAt ? new Date(formData.startAt) : null;
  const endDate = formData.endAt ? new Date(formData.endAt) : null;
  const days = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = selectedVehicle && days > 0 ? selectedVehicle.dailyPrice * days : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Đặt xe mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
              Chọn xe *
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>-- Chọn xe --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.title} - {vehicle.licensePlate} - {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
                </option>
              ))}
            </select>
            {selectedVehicle && (
              <p className="mt-2 text-sm text-gray-600">
                Loại: {selectedVehicle.vehicleType} | Giá/ngày: {selectedVehicle.dailyPrice.toLocaleString('vi-VN')} {selectedVehicle.currency}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu *
              </label>
              <input
                id="startAt"
                name="startAt"
                type="datetime-local"
                value={formData.startAt}
                onChange={handleChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc *
              </label>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
                value={formData.endAt}
                onChange={handleChange}
                required
                min={formData.startAt || new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {days > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Số ngày thuê:</span>
                <span className="text-lg font-bold text-blue-600">{days} ngày</span>
              </div>
              {selectedVehicle && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-700">Tổng tiền:</span>
                  <span className="text-lg font-bold text-green-600">
                    {totalPrice.toLocaleString('vi-VN')} {selectedVehicle.currency}
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ghi chú (nếu có)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !formData.vehicleId || days <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang tạo...' : 'Tạo đặt xe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

