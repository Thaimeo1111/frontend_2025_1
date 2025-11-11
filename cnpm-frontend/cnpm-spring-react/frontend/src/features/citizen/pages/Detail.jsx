import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CitizenForm } from '../components/CitizenForm';
import citizenApi from '../../../api/citizenApi';
import householdApi from '../../../api/householdApi';
import Loader from '../../../components/Loader';
import ErrorMessage from '../../../components/ErrorMessage';
import useApiHandler from '../../../hooks/useApiHandler';

const CitizenDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // State cho thông báo
  const [householdOptions, setHouseholdOptions] = useState([]); // Danh sách hộ khẩu
  
  // Detect "new" mode từ pathname
  const isNew = location.pathname === '/citizen/new';
  
  // DEBUG: Log param và pathname
  console.log('CitizenDetail mounted with id:', id, 'pathname:', location.pathname);
  console.log('isNew:', isNew);
  
  const {
    data: citizen,
    loading,
    error,
    handleApi
  } = useApiHandler(null);

  const fetchCitizen = async () => {
    if (isNew) return; // Khi tạo mới, không cần fetch
    await handleApi(
      () => citizenApi.getById(id),
      'Không thể tải thông tin nhân khẩu'
    );
  };

  const fetchHouseholds = async () => {
    try {
      const response = await householdApi.getAll();
      const households = Array.isArray(response.data) ? response.data : response.data?.data || [];
      // Transform thành options format - using chuHo (household head name) as label
      const options = households.map(h => ({
        value: h.id,
        label: h.chuHo || `Hộ ${h.maHoKhau || h.id}`
      }));
      setHouseholdOptions(options);
      console.log('Loaded household options:', options);
    } catch (err) {
      console.error('Lỗi tải danh sách hộ khẩu:', err);
    }
  };

  useEffect(() => {
    fetchCitizen();
    fetchHouseholds(); // Load household list khi component mount
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      // Dùng isNew thay vì (id === 'new')
      await handleApi(
        () => isNew ? citizenApi.create(data) : citizenApi.update(id, data),
        'Không thể lưu thông tin nhân khẩu'
      );
      
      // Hiển thị thông báo thành công
      const message = isNew ? 'Thêm nhân khẩu thành công!' : 'Cập nhật nhân khẩu thành công!';
      setToast({
        type: 'success',
        message: message
      });
      
      // Tự động quay lại sau 2 giây
      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    } catch (err) {
      // Log chi tiết lỗi từ backend
      console.error('Submit error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      // Hiển thị thông báo lỗi
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Lỗi khi lưu dữ liệu'
      });
    }
  };

  // Auto close toast sau 3 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading && !isNew) return <Loader />;
  if (error && !isNew) return <ErrorMessage message={error} onRetry={fetchCitizen} />;

  return (
    <div className="container mx-auto px-4">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-fade-in ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <span className="text-xl">✓</span>
            ) : (
              <span className="text-xl">✕</span>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Thêm nhân khẩu mới' : 'Chi tiết nhân khẩu'}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <CitizenForm 
          initialValues={citizen}
          onSubmit={handleSubmit}
          householdOptions={householdOptions}
        />
      </div>
    </div>
  );
};

export default CitizenDetail;