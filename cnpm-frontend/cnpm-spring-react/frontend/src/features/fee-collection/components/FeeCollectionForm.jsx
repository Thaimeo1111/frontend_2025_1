import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../../components/Form/FormInput';
import FormSelect from '../../../components/Form/FormSelect';
import feePeriodApi from '../../../api/feePeriodApi';
import householdApi from '../../../api/householdApi';

const schema = yup.object().shape({
  dotThuPhiId: yup.string().required('Vui lòng chọn đợt thu phí'),
  hoKhauId: yup.string().required('Vui lòng chọn hộ khẩu'),
  soTien: yup.number()
    .positive('Số tiền phải lớn hơn 0')
    .required('Vui lòng nhập số tiền'),
  ngayThu: yup.date().required('Vui lòng nhập ngày thu'),
  trangThai: yup.string().required('Vui lòng chọn trạng thái')
});

const statusOptions = [
  { value: 'CHUA_NOP', label: 'Chưa nộp' },
  { value: 'DA_NOP', label: 'Đã nộp' }
];

export const FeeCollectionForm = ({ initialValues, onSubmit }) => {
  const [feePeriods, setFeePeriods] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [periodsRes, householdsRes] = await Promise.all([
          feePeriodApi.getAll(),
          householdApi.getAll()
        ]);

        setFeePeriods(periodsRes.data.map(period => ({
          value: period.id,
          label: period.tenDotThu
        })));

        setHouseholds(householdsRes.data.map(household => ({
          value: household.id,
          label: `${household.maHoKhau} - ${household.chuHo}`
        })));
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSelect
        label="Đợt thu phí"
        register={register}
        name="dotThuPhiId"
        options={feePeriods}
        error={errors.dotThuPhiId}
      />

      <FormSelect
        label="Hộ khẩu"
        register={register}
        name="hoKhauId"
        options={households}
        error={errors.hoKhauId}
      />

      <FormInput
        label="Số tiền"
        type="number"
        register={register}
        name="soTien"
        error={errors.soTien}
      />

      <FormInput
        label="Ngày thu"
        type="date"
        register={register}
        name="ngayThu"
        error={errors.ngayThu}
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