import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Vehicle, VehicleRequest, VehicleType } from '../types';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (data: VehicleRequest) => void;
}

const VehicleModal = ({ vehicle, onClose, onSave }: VehicleModalProps) => {
  const [formData, setFormData] = useState<VehicleRequest>({
    title: '',
    vehicleType: 'SEDAN' as VehicleType,
    licensePlate: '',
    dailyPrice: 0,
    currency: 'VND',
    description: '',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title,
        vehicleType: vehicle.vehicleType,
        licensePlate: vehicle.licensePlate,
        dailyPrice: vehicle.dailyPrice,
        currency: vehicle.currency,
        description: vehicle.description || '',
      });
    }
  }, [vehicle]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'dailyPrice' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const vehicleTypes: VehicleType[] = [
    'SEDAN',
    'SUV',
    'HATCHBACK',
    'COUPE',
    'CONVERTIBLE',
    'WAGON',
    'PICKUP',
    'VAN',
    'MOTORCYCLE',
  ];

  const vehicleTypeLabels: Record<VehicleType, string> = {
    SEDAN: 'Sedan',
    SUV: 'SUV',
    HATCHBACK: 'Hatchback',
    COUPE: 'Coupe',
    CONVERTIBLE: 'Convertible',
    WAGON: 'Wagon',
    PICKUP: 'Pickup',
    VAN: 'Van',
    MOTORCYCLE: 'Xe máy',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {vehicle ? 'Sửa thông tin xe' : 'Thêm xe mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tên xe *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                Loại xe *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {vehicleTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                Biển số *
              </label>
              <input
                id="licensePlate"
                name="licensePlate"
                type="text"
                value={formData.licensePlate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dailyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Giá/ngày *
              </label>
              <input
                id="dailyPrice"
                name="dailyPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.dailyPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Tiền tệ *
              </label>
              <input
                id="currency"
                name="currency"
                type="text"
                maxLength={3}
                value={formData.currency}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {vehicle ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;

