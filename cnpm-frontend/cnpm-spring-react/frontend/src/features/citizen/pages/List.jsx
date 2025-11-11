import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/Table/DataTable';
import CitizenSearch from '../components/CitizenSearch';
import CitizenStats from '../components/CitizenStats';
import useApiHandler from '../../../hooks/useApiHandler';
import citizenApi from '../../../api/citizenApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';

const CitizenList = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ gender: null, age: null });
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showModal, setShowModal] = useState(null); // 'tamvang', 'tamtru', 'khaitu'
  
  const {
    data,
    loading,
    error,
    handleApi
  } = useApiHandler({});

  const columns = [
    { key: 'hoTen', title: 'Họ tên' },
    { key: 'ngaySinh', title: 'Ngày sinh' },
    { key: 'gioiTinh', title: 'Giới tính' },
    { key: 'cccd', title: 'CCCD' },
    {
      key: 'trangThai',
      title: 'Trạng thái',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'THUONG_TRU' ? 'bg-green-100 text-green-800' : 
          value === 'TAM_TRU' ? 'bg-blue-100 text-blue-800' : 
          value === 'TAM_VANG' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value === 'THUONG_TRU' ? 'Thường trú' : 
           value === 'TAM_TRU' ? 'Tạm trú' : 
           value === 'TAM_VANG' ? 'Tạm vắng' : 
           value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTamVang(row);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
            title="Tạm vắng"
          >
            Tạm vắng
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTamTru(row);
            }}
            className="text-green-600 hover:text-green-800 text-sm"
            title="Tạm trú"
          >
            Tạm trú
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleKhaiTu(row);
            }}
            className="text-red-600 hover:text-red-800 text-sm"
            title="Khai tử"
          >
            Khai tử
          </button>
        </div>
      )
    }
  ];

  const fetchCitizens = async () => {
    await handleApi(
      () => citizenApi.getAll(),
      'Không thể tải danh sách nhân khẩu'
    );
  };

  const fetchStats = async () => {
    try {
      const [genderData, ageData] = await Promise.all([
        citizenApi.getGenderStats(),
        citizenApi.getAgeStats()
      ]);
      setStats({
        gender: genderData.data,
        age: ageData.data
      });
    } catch (err) {
      console.error('Không thể tải thống kê:', err);
    }
  };

  useEffect(() => {
    fetchCitizens();
    fetchStats();
  }, []);

  const handleAdd = () => navigate('/citizen/new');
  const handleEdit = (row) => navigate(`/citizen/${row.id}`);
  const handleView = (row) => navigate(`/citizen/${row.id}`);
  const handleDelete = async (row) => {
    if (!window.confirm('Xác nhận xóa nhân khẩu này?')) return;
    try {
      await handleApi(
        () => citizenApi.delete(row.id),
        'Không thể xóa nhân khẩu'
      );
      await fetchCitizens();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      await fetchCitizens();
      return;
    }
    try {
      await handleApi(
        () => citizenApi.search({ q: searchTerm }),
        'Không thể tìm kiếm nhân khẩu'
      );
    } catch (err) {
      // Error handled by hook
    }
  };

  // Handlers for special actions
  const handleTamVang = (citizen) => {
    setSelectedCitizen(citizen);
    setShowModal('tamvang');
  };

  const handleTamTru = (citizen) => {
    setSelectedCitizen(citizen);
    setShowModal('tamtru');
  };

  const handleKhaiTu = (citizen) => {
    setSelectedCitizen(citizen);
    setShowModal('khaitu');
  };

  const handleCancelTamVang = async (citizen) => {
    if (!window.confirm(`Xác nhận huỷ tạm vắng cho ${citizen.hoTen}?`)) return;
    try {
      await citizenApi.deleteTamVang(citizen.id);
      alert('Đã huỷ tạm vắng thành công');
      await fetchCitizens();
    } catch (err) {
      alert('Không thể huỷ tạm vắng: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelTamTru = async (citizen) => {
    if (!window.confirm(`Xác nhận huỷ tạm trú cho ${citizen.hoTen}?`)) return;
    try {
      await citizenApi.deleteTamTru(citizen.id);
      alert('Đã huỷ tạm trú thành công');
      await fetchCitizens();
    } catch (err) {
      alert('Không thể huỷ tạm trú: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (showModal === 'tamvang') {
        await citizenApi.updateTamVang(selectedCitizen.id, formData);
        alert('Đã cập nhật tạm vắng thành công');
      } else if (showModal === 'tamtru') {
        await citizenApi.updateTamTru(selectedCitizen.id, formData);
        alert('Đã cập nhật tạm trú thành công');
      } else if (showModal === 'khaitu') {
        await citizenApi.updateKhaiTu(selectedCitizen.id, formData);
        alert('Đã khai tử thành công');
      }
      setShowModal(null);
      setSelectedCitizen(null);
      await fetchCitizens();
      await fetchStats(); // Refresh stats after update
    } catch (err) {
      alert('Không thể thực hiện: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCitizens} />;

  // Transform data - API có thể trả về array hoặc object
  const citizens = Array.isArray(data) ? data : (data?.data || []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhân khẩu</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Thêm nhân khẩu
        </button>
      </div>

      <CitizenSearch onSearch={handleSearch} />

      {/* Statistics section */}
      {stats.gender && stats.age && (
        <div className="mb-6">
          <CitizenStats genderStats={stats.gender} ageStats={stats.age} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={citizens}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          basePath="/citizen"
        />
      </div>

      {/* Modal for Tạm vắng */}
      {showModal === 'tamvang' && selectedCitizen && (
        <Modal
          title={`Cập nhật tạm vắng - ${selectedCitizen.hoTen}`}
          onClose={() => {
            setShowModal(null);
            setSelectedCitizen(null);
          }}
          onSubmit={handleModalSubmit}
        >
          <TamVangForm />
        </Modal>
      )}

      {/* Modal for Tạm trú */}
      {showModal === 'tamtru' && selectedCitizen && (
        <Modal
          title={`Cập nhật tạm trú - ${selectedCitizen.hoTen}`}
          onClose={() => {
            setShowModal(null);
            setSelectedCitizen(null);
          }}
          onSubmit={handleModalSubmit}
        >
          <TamTruForm />
        </Modal>
      )}

      {/* Modal for Khai tử */}
      {showModal === 'khaitu' && selectedCitizen && (
        <Modal
          title={`Khai tử - ${selectedCitizen.hoTen}`}
          onClose={() => {
            setShowModal(null);
            setSelectedCitizen(null);
          }}
          onSubmit={handleModalSubmit}
        >
          <KhaiTuForm />
        </Modal>
      )}
    </div>
  );
};

// Simple Modal Component
const Modal = ({ title, onClose, onSubmit, children }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {React.cloneElement(children, { formData, setFormData })}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Xác nhận
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tạm vắng Form
const TamVangForm = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
      <input
        type="date"
        value={formData.ngayBatDau || ''}
        onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Ngày kết thúc (dự kiến)</label>
      <input
        type="date"
        value={formData.ngayKetThuc || ''}
        onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Địa chỉ tạm vắng</label>
      <textarea
        value={formData.diaChiTamVang || ''}
        onChange={(e) => setFormData({ ...formData, diaChiTamVang: e.target.value })}
        className="w-full border rounded px-3 py-2"
        rows="3"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Lý do</label>
      <textarea
        value={formData.lyDo || ''}
        onChange={(e) => setFormData({ ...formData, lyDo: e.target.value })}
        className="w-full border rounded px-3 py-2"
        rows="2"
      />
    </div>
  </div>
);

// Tạm trú Form
const TamTruForm = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
      <input
        type="date"
        value={formData.ngayBatDau || ''}
        onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Ngày kết thúc (dự kiến)</label>
      <input
        type="date"
        value={formData.ngayKetThuc || ''}
        onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Địa chỉ thường trú</label>
      <textarea
        value={formData.diaChiThuongTru || ''}
        onChange={(e) => setFormData({ ...formData, diaChiThuongTru: e.target.value })}
        className="w-full border rounded px-3 py-2"
        rows="3"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Lý do</label>
      <textarea
        value={formData.lyDo || ''}
        onChange={(e) => setFormData({ ...formData, lyDo: e.target.value })}
        className="w-full border rounded px-3 py-2"
        rows="2"
      />
    </div>
  </div>
);

// Khai tử Form
const KhaiTuForm = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Ngày mất</label>
      <input
        type="date"
        value={formData.ngayMat || ''}
        onChange={(e) => setFormData({ ...formData, ngayMat: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Nguyên nhân</label>
      <textarea
        value={formData.nguyenNhan || ''}
        onChange={(e) => setFormData({ ...formData, nguyenNhan: e.target.value })}
        className="w-full border rounded px-3 py-2"
        rows="3"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Nơi mất</label>
      <input
        type="text"
        value={formData.noiMat || ''}
        onChange={(e) => setFormData({ ...formData, noiMat: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Số giấy khai tử</label>
      <input
        type="text"
        value={formData.soGiayKhaiTu || ''}
        onChange={(e) => setFormData({ ...formData, soGiayKhaiTu: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  </div>
);

export default CitizenList;