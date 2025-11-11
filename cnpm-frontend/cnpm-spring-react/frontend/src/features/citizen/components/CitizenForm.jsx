import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../../components/Form/FormInput';
import FormSelect from '../../../components/Form/FormSelect';

const schema = yup.object().shape({
  hoKhauId: yup.number().typeError('Vui lòng chọn hộ khẩu').required('Vui lòng chọn hộ khẩu'),
  hoTen: yup.string().required('Vui lòng nhập họ tên'),
  ngaySinh: yup.date().required('Vui lòng nhập ngày sinh'),
  gioiTinh: yup.string().required('Vui lòng chọn giới tính'),
  danToc: yup.string().required('Vui lòng nhập dân tộc'),
  quocTich: yup.string().required('Vui lòng nhập quốc tịch'),
  ngheNghiep: yup.string().required('Vui lòng nhập nghề nghiệp'),
  cmndCccd: yup.string()
    .matches(/^\d{9,12}$/, 'CMND/CCCD phải có 9-12 chữ số')
    .required('Vui lòng nhập CMND/CCCD'),
  ngayCap: yup.date().required('Vui lòng nhập ngày cấp'),
  noiCap: yup.string().required('Vui lòng nhập nơi cấp'),
  quanHeChuHo: yup.string().required('Vui lòng nhập quan hệ với chủ hộ'),
  ghiChu: yup.string(),
  trangThai: yup.string().required('Vui lòng chọn trạng thái')
});

const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' }
];

const statusOptions = [
  { value: 'THUONG_TRU', label: 'Thường trú' },
  { value: 'TAM_TRU', label: 'Tạm trú' },
  { value: 'TAM_VANG', label: 'Tạm vắng' }
];

const relationshipOptions = [
  { value: 'Chủ hộ', label: 'Chủ hộ' },
  { value: 'Vợ/Chồng', label: 'Vợ/Chồng' },
  { value: 'Con', label: 'Con' },
  { value: 'Cha/Mẹ', label: 'Cha/Mẹ' },
  { value: 'Anh/Chị/Em', label: 'Anh/Chị/Em' },
  { value: 'Ông/Bà', label: 'Ông/Bà' },
  { value: 'Cháu', label: 'Cháu' },
  { value: 'Khác', label: 'Khác' }
];

// Helper: Transform giá trị giới tính - try multiple formats
const transformGender = (value) => {
  // Format 1: Giữ nguyên (Nam, Nữ)
  return value;
  
  // Nếu cần, có thể thử:
  // Format 2: Uppercase (NAM, NỮ)
  // return value.toUpperCase();
  
  // Format 3: Số (0, 1)
  // return value === 'Nam' ? '0' : '1';
  
  // Format 4: English (MALE, FEMALE)
  // return value === 'Nam' ? 'MALE' : 'FEMALE';
};

export const CitizenForm = ({ initialValues, onSubmit, householdOptions = [] }) => {
  const [submitError, setSubmitError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  const onSubmitHandler = (data) => {
    // Clear previous errors
    setSubmitError(null);
    
    // Transform data: giữ camelCase format (backend expect camelCase, không phải snake_case!)
    const submitData = {
      hoKhauId: parseInt(data.hoKhauId, 10), // Convert string to number
      hoTen: data.hoTen,
      ngaySinh: data.ngaySinh instanceof Date 
        ? data.ngaySinh.toISOString().split('T')[0]
        : data.ngaySinh,
      gioiTinh: transformGender(data.gioiTinh),
      danToc: data.danToc,
      quocTich: data.quocTich,
      ngheNghiep: data.ngheNghiep,
      cmndCccd: data.cmndCccd,
      ngayCap: data.ngayCap instanceof Date 
        ? data.ngayCap.toISOString().split('T')[0]
        : data.ngayCap,
      noiCap: data.noiCap,
      quanHeChuHo: data.quanHeChuHo,
      ghiChu: data.ghiChu || '',
      trangThai: data.trangThai
    };
    
    console.log('Form submitted with data (camelCase):', submitData);
    
    try {
      onSubmit(submitData);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Lỗi khi lưu dữ liệu');
      console.error('Submit error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Lỗi:</strong> {submitError}
        </div>
      )}

      <FormSelect
        label="Hộ khẩu"
        register={register}
        name="hoKhauId"
        options={householdOptions}
        error={errors.hoKhauId}
      />

      <FormInput
        label="Họ và tên"
        register={register}
        name="hoTen"
        error={errors.hoTen}
      />

      <FormInput
        label="Ngày sinh"
        type="date"
        register={register}
        name="ngaySinh"
        error={errors.ngaySinh}
      />

      <FormSelect
        label="Giới tính"
        register={register}
        name="gioiTinh"
        options={genderOptions}
        error={errors.gioiTinh}
      />

      <FormInput
        label="Dân tộc"
        register={register}
        name="danToc"
        error={errors.danToc}
        placeholder="Ví dụ: Kinh"
      />

      <FormInput
        label="Quốc tịch"
        register={register}
        name="quocTich"
        error={errors.quocTich}
        placeholder="Ví dụ: Việt Nam"
      />

      <FormInput
        label="Nghề nghiệp"
        register={register}
        name="ngheNghiep"
        error={errors.ngheNghiep}
        placeholder="Ví dụ: Kỹ sư"
      />

      <FormInput
        label="CMND/CCCD"
        register={register}
        name="cmndCccd"
        error={errors.cmndCccd}
        placeholder="9-12 chữ số"
      />

      <FormInput
        label="Ngày cấp"
        type="date"
        register={register}
        name="ngayCap"
        error={errors.ngayCap}
      />

      <FormInput
        label="Nơi cấp"
        register={register}
        name="noiCap"
        error={errors.noiCap}
        placeholder="Ví dụ: Công an TP. Hà Nội"
      />

      <FormSelect
        label="Quan hệ với chủ hộ"
        register={register}
        name="quanHeChuHo"
        options={relationshipOptions}
        error={errors.quanHeChuHo}
      />

      <FormInput
        label="Ghi chú"
        register={register}
        name="ghiChu"
        error={errors.ghiChu}
        placeholder="Thông tin bổ sung (không bắt buộc)"
      />

      <FormSelect
        label="Trạng thái"
        register={register}
        name="trangThai"
        options={statusOptions}
        error={errors.trangThai}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};