import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HouseholdForm } from '../components/HouseholdForm';
import FeeByHousehold from '../../fee-collection/components/FeeByHousehold';
import householdApi from '../../../api/householdApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const HouseholdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: household,
    loading,
    error,
    handleApi
  } = useApiHandler(null);

  const fetchHousehold = async () => {
    if (id === 'new') return;
    await handleApi(
      () => householdApi.getById(id),
      'Không thể tải thông tin hộ khẩu'
    );
  };

  useEffect(() => {
    fetchHousehold();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      const isNew = id === 'new';
      await handleApi(
        () => isNew
          ? householdApi.create(data)
          : householdApi.update(id, data),
        `Không thể ${isNew ? 'tạo mới' : 'cập nhật'} thông tin hộ khẩu`
      );
      
      // Show success message
      alert(`${isNew ? 'Tạo mới' : 'Cập nhật'} hộ khẩu thành công!`);
      
      navigate('/household');
    } catch (err) {
      // Error is handled by handleApi
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHousehold} />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Thêm hộ khẩu mới' : `Chi tiết hộ khẩu ${household?.soHoKhau || ''}`}
        </h1>
        <button
          onClick={() => navigate('/household')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          ← Quay lại danh sách
        </button>
      </div>

      <div className="space-y-6">
        {/* Household information card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {id === 'new' ? 'Thông tin hộ khẩu mới' : 'Thông tin hộ khẩu'}
          </h2>
          <HouseholdForm
            initialValues={household || {}}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Fee collection history - only show for existing household */}
        {id !== 'new' && household && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Lịch sử đóng phí</h2>
            <FeeByHousehold householdId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseholdDetail;