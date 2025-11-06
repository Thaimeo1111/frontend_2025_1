import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CitizenStats from "../../citizen/components/CitizenStats";
import FeeStats from "../../fee-collection/components/FeeStats";
import citizenApi from "../../../api/citizenApi";
import feeCollectionApi from "../../../api/feeCollectionApi";
import Loader from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    citizen: null,
    feeCollection: null,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [citizenStats, feeStats] = await Promise.all([
        citizenApi.getStats(),
        feeCollectionApi.getStats(),
      ]);

      setStats({
        citizen: citizenStats.data,
        feeCollection: feeStats.data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Xin chào,{" "}
          <span className="font-semibold">{user?.email}</span> 👋
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Trang chủ
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

        <div className="grid gap-6">
          <CitizenStats
            genderStats={stats.citizen?.genderStats}
            ageStats={stats.citizen?.ageStats}
          />

          <FeeStats stats={stats.feeCollection} />
        </div>
      </div>
    </div>
  );
}
