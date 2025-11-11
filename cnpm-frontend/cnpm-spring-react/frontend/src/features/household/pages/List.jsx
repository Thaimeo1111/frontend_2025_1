import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/Table/DataTable';
import householdApi from '../../../api/householdApi';
import { HouseholdModal } from '../components/HouseholdModal';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const HouseholdList = () => {
  const navigate = useNavigate();
  const {
    data: households,
    loading,
    error,
    handleApi
  } = useApiHandler([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'soHoKhau', title: 'Số hộ khẩu' },
    { key: 'tenChuHo', title: 'Tên chủ hộ' },
    { key: 'diaChi', title: 'Địa chỉ' },
    { key: 'soThanhVien', title: 'Số thành viên' }
  ];

  const fetchHouseholds = async () => {
    await handleApi(
      () => householdApi.getAll(),
      'Không thể tải danh sách hộ khẩu'
    );
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleAdd = () => {
    setSelectedHousehold(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedHousehold(row);
    setIsModalOpen(true);
  };

  const handleView = (row) => navigate(`/household/${row.id}`);

  const handleDelete = async (row) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hộ khẩu "${row.soHoKhau}" - ${row.tenChuHo}?`)) return;
    try {
      await handleApi(
        () => householdApi.delete(row.id),
        'Không thể xóa hộ khẩu'
      );
      
      // Show success message
      alert('Xóa hộ khẩu thành công!');
      
      await fetchHouseholds();
    } catch (err) {
      // Error is handled by handleApi
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedHousehold(null);
  };

  const handleModalSave = async (data) => {
    try {
      const isNew = !selectedHousehold;
      await handleApi(
        () => isNew
          ? householdApi.create(data)
          : householdApi.update(selectedHousehold.id, data),
        `Không thể ${isNew ? 'tạo mới' : 'cập nhật'} hộ khẩu`
      );
      
      // Show success message
      alert(`${isNew ? 'Tạo mới' : 'Cập nhật'} hộ khẩu thành công!`);
      
      await fetchHouseholds();
      handleModalClose();
    } catch (err) {
      // Error is handled by handleApi
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHouseholds} />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý hộ khẩu</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Thêm hộ khẩu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={households}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          basePath="/household"
        />
      </div>

      <HouseholdModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        household={selectedHousehold}
      />
    </div>
  );
};

export default HouseholdList;