import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/Table/DataTable';
import feeCollectionApi from '../../../api/feeCollectionApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const FeeCollectionList = () => {
  const navigate = useNavigate();
  const {
    data: collections,
    loading,
    error,
    handleApi
  } = useApiHandler([]);

  const columns = [
    { key: 'maHoKhau', title: 'Mã hộ khẩu' },
    { key: 'tenDotThu', title: 'Đợt thu' },
    { key: 'soTien', title: 'Số tiền' },
    { key: 'ngayThu', title: 'Ngày thu' },
    {
      key: 'trangThai',
      title: 'Trạng thái',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'DA_NOP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'DA_NOP' ? 'Đã nộp' : 'Chưa nộp'}
        </span>
      )
    }
  ];

  const fetchCollections = async () => {
    await handleApi(
      () => feeCollectionApi.getAll(),
      'Không thể tải danh sách thu phí'
    );
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleAdd = () => navigate('/fee-collection/new');
  const handleEdit = (row) => navigate(`/fee-collection/${row.id}`);
  const handleView = (row) => navigate(`/fee-collection/${row.id}`);
  const handleDelete = async (row) => {
    if (!window.confirm('Xác nhận xóa khoản thu này?')) return;
    try {
      await handleApi(
        () => feeCollectionApi.delete(row.id),
        'Không thể xóa khoản thu'
      );
      await fetchCollections();
    } catch (err) {}
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCollections} />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thu phí</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Thu phí mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={collections}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          basePath="/fee-collection"
        />
      </div>
    </div>
  );
};

export default FeeCollectionList;