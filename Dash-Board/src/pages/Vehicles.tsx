import { useEffect, useState } from 'react';
import { vehicleApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { Vehicle, VehicleRequest, VehicleType, VehicleStatus } from '../types';
import VehicleModal from '../components/VehicleModal';

const Vehicles = () => {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<VehicleType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<VehicleStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filterType, filterStatus]);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleApi.list();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'ALL') {
      filtered = filtered.filter((v) => v.vehicleType === filterType);
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((v) => v.status === filterStatus);
    }

    setFilteredVehicles(filtered);
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      return;
    }

    try {
      await vehicleApi.delete(id);
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Xóa xe thất bại');
    }
  };

  const handleSave = async (data: VehicleRequest) => {
    try {
      if (editingVehicle) {
        await vehicleApi.update(editingVehicle.id, data);
      } else {
        await vehicleApi.create(data);
      }
      setShowModal(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Lưu xe thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

  const statusLabels: Record<VehicleStatus, string> = {
    AVAILABLE: 'Có sẵn',
    RENTED: 'Đang thuê',
    MAINTENANCE: 'Bảo trì',
    OUT_OF_SERVICE: 'Ngừng hoạt động',
  };

  const statusColors: Record<VehicleStatus, string> = {
    AVAILABLE: 'bg-green-100 text-green-800',
    RENTED: 'bg-blue-100 text-blue-800',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    OUT_OF_SERVICE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý xe</h1>
          <p className="text-gray-600 mt-2">Danh sách và quản lý các xe trong hệ thống</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm xe</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as VehicleType | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">Tất cả loại xe</option>
            {Object.entries(vehicleTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as VehicleStatus | 'ALL')}
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
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vehicle.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{vehicleTypeLabels[vehicle.vehicleType]}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status]}`}>
                  {statusLabels[vehicle.status]}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biển số:</span>
                  <span className="font-medium">{vehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá/ngày:</span>
                  <span className="font-medium text-green-600">
                    {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
                  </span>
                </div>
              </div>

              {vehicle.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>
              )}

              {isAdmin && (
                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Không tìm thấy xe nào</p>
        </div>
      )}

      {showModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => {
            setShowModal(false);
            setEditingVehicle(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Vehicles;

