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
          value === 'THUONG_TRU' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value === 'THUONG_TRU' ? 'Thường trú' : 'Tạm trú'}
        </span>
      )
    }
  ];

  const fetchCitizens = async () => {
    await handleApi(
      () => citizenApi.getAll(),
      'Không thể tải danh sách nhân khẩu'
    );
  };

  useEffect(() => {
    fetchCitizens();
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
    try {
      await handleApi(
        () => citizenApi.search({ q: searchTerm }),
        'Không thể tìm kiếm nhân khẩu'
      );
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCitizens} />;

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

      <div className="mb-6">
        <CitizenStats genderStats={data?.stats?.gender} ageStats={data?.stats?.age} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={data?.items || []}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          basePath="/citizen"
        />
      </div>
    </div>
  );
};

export default CitizenList;