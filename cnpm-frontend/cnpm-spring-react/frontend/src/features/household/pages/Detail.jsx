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
      await handleApi(
        () => id === 'new'
          ? householdApi.create(data)
          : householdApi.update(id, data),
        'Không thể lưu thông tin hộ khẩu'
      );
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
          {id === 'new' ? 'Thêm hộ khẩu mới' : 'Chi tiết hộ khẩu'}
        </h1>
        <button
          onClick={() => navigate('/household')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>

      <div className="space-y-6">
        {/* Existing household form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HouseholdForm
            initialValues={household || {}}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Fee collection history */}
        {id !== 'new' && (
          <FeeByHousehold householdId={id} />
        )}
      </div>
    </div>
  );
};

export default HouseholdDetail;