import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  FieldOwnerFilter,
  FieldOwnerRequest,
} from '../../service/admin/fieldOwnerService';
import { fieldOwnerService } from '../../service/admin/fieldOwnerService';

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const statusOptions: { label: string; value: FieldOwnerFilter }[] = [
  { label: 'Đang chờ', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Đã từ chối', value: 'REJECTED' },
  { label: 'Tất cả', value: 'ALL' },
];

const statusBadge: Record<FieldOwnerRequest['status'], string> = {
  PENDING: 'badge bg-warning text-dark',
  APPROVED: 'badge bg-success',
  REJECTED: 'badge bg-danger',
};

const SIDEBAR_WIDTH = 260;

const FieldOwnerRequests: React.FC = () => {
  const [requests, setRequests] = useState<FieldOwnerRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<FieldOwnerFilter>('PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOffset, setSidebarOffset] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fieldOwnerService.getRequests(statusFilter);
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOffset = () => {
      setSidebarOffset(window.innerWidth >= 992 ? SIDEBAR_WIDTH : 0);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return requests;
    const keyword = searchTerm.toLowerCase();
    return requests.filter((item) =>
      [
        item.businessName,
        item.businessEmail,
        item.phone,
        item.address,
        item.username,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [requests, searchTerm]);

  const buildCloudinaryUrl = (path: string | null) =>
    path ? `${CLOUDINARY_BASE}/${path}` : undefined;

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
  };

  const handleApprove = async (ownerId: number) => {
    const confirmApprove = window.confirm('Bạn có chắc muốn duyệt yêu cầu này?');
    if (!confirmApprove) return;

    try {
      setLoading(true);
      await fieldOwnerService.approveRequest(ownerId);
      await fetchData();
      alert('Đã duyệt yêu cầu thành công.');
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || 'Duyệt yêu cầu thất bại.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (ownerId: number) => {
    const reason = window.prompt('Nhập lý do từ chối (bắt buộc):');
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do từ chối.');
      return;
    }

    try {
      setLoading(true);
      await fieldOwnerService.rejectRequest(ownerId, reason.trim());
      await fetchData();
      alert('Đã từ chối yêu cầu.');
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || 'Từ chối yêu cầu thất bại.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-wrapper py-4"
      style={{
        marginLeft: sidebarOffset,
        paddingLeft: sidebarOffset ? "1.5rem" : "1rem",
        paddingRight: "1.5rem",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
      }}
    >
      <div className="container-fluid bg-white px-2 px-lg-4 p-4 " style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div className="mb-4 p-4  rounded shadow-sm">
          <h2 className="h4 mb-1 fw-bold">Quản lý yêu cầu chủ sân</h2>
          <p className="text-muted mb-0">
            Theo dõi & xử lý các yêu cầu đăng ký trở thành chủ sân.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 p-3  rounded shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-lg-4 col-md-6">
              <input
                type="search"
                className="form-control form-control-lg"
                placeholder=" Tìm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-8 col-md-6 text-lg-end">
              <div className="btn-group">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`btn ${statusFilter === opt.value
                      ? "btn-primary"
                      : "btn-outline-primary"
                      }`}
                    onClick={() => setStatusFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-muted small mt-2">
            {filteredRequests.length} yêu cầu được tìm thấy.
          </div>
        </div>

        {/* Content */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger m-3">{error}</div>
            ) : filteredRequests.length === 0 ? (
              <div className="alert alert-info m-3">
                Không có yêu cầu nào cho trạng thái hiện tại.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Tên đơn vị</th>
                      <th>Liên hệ</th>
                      <th>Giấy tờ</th>
                      <th>Trạng thái</th>
                      <th>Thời gian</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((item, i) => (
                      <tr key={item.ownerId}>
                        <td>{i + 1}</td>

                        <td>
                          <div className="fw-semibold">
                            {item.businessName || "—"}
                          </div>
                          <div className="text-muted small">
                            🧑 {item.username}
                          </div>
                        </td>

                        <td>
                          <div>{item.businessEmail}</div>
                          <div className="text-muted small">📞 {item.phone}</div>
                          <div className="text-muted small">📍 {item.address}</div>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-1 small">
                            {buildCloudinaryUrl(item.idFrontUrl) && (
                              <a href={buildCloudinaryUrl(item.idFrontUrl)} target="_blank">
                                🪪 Mặt trước
                              </a>
                            )}
                            {buildCloudinaryUrl(item.idBackUrl) && (
                              <a href={buildCloudinaryUrl(item.idBackUrl)} target="_blank">
                                🪪 Mặt sau
                              </a>
                            )}
                            {buildCloudinaryUrl(item.businessLicenseUrl) && (
                              <a href={buildCloudinaryUrl(item.businessLicenseUrl)} target="_blank">
                                📄 Giấy phép KD
                              </a>
                            )}
                            {!buildCloudinaryUrl(item.idFrontUrl) && (
                              <span className="text-muted">Chưa cung cấp</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={statusBadge[item.status]}>{item.status}</span>
                          {item.status === "REJECTED" && item.rejectReason && (
                            <div className="text-muted small mt-1">
                              ⚠ {item.rejectReason}
                            </div>
                          )}
                        </td>

                        <td className="small text-muted">
                          <div>Gửi: {formatDate(item.createdAt)}</div>
                          <div>Cập nhật: {formatDate(item.updatedAt)}</div>
                        </td>

                        <td className="text-end">
                          {item.status === "PENDING" ? (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-success px-3"
                                onClick={() => handleApprove(item.ownerId)}
                                disabled={loading}
                              >
                                ✔ Duyệt
                              </button>
                              <button
                                className="btn btn-outline-danger px-3"
                                onClick={() => handleReject(item.ownerId)}
                                disabled={loading}
                              >
                                ✖ Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default FieldOwnerRequests;
