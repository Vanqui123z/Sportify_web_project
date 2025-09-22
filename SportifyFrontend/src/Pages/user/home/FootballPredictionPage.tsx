import React, { useEffect, useState, useMemo } from "react";

type Match = {
  id: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  competition: string;
  venue: string;
  status: string;
  predictedScore?: string;
  aiConfidence?: number;
  aiAnalysis?: string;
  recommendation?: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
};

type ApiStatus = {
  season?: string;
  competition?: string;
  message: string;
  status: string;
};

type ApiResponse = {
  apiInfo?: string;
  apiStatus?: ApiStatus;
  upcomingMatches?: Match[];
};

const defaultTeamLogo = "/user/images/team-default.png";

const FootballPredictionPage: React.FC = () => {
  const [data, setData] = useState<ApiResponse>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 12;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [modalMatch, setModalMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/sportify/football-prediction")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  // Autocomplete team names
  const allTeams = useMemo(() => {
    const teams = new Set<string>();
    data.upcomingMatches?.forEach((m) => {
      teams.add(m.homeTeam);
      teams.add(m.awayTeam);
    });
    return Array.from(teams);
  }, [data.upcomingMatches]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let matches = data.upcomingMatches || [];
    // Search
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      matches = matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(s) ||
          m.awayTeam.toLowerCase().includes(s)
      );
    }
    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      matches = matches.filter((m) => {
        const matchDate = new Date(m.date);
        if (dateFilter === "today") {
          return matchDate.toDateString() === today.toDateString();
        }
        if (dateFilter === "tomorrow") {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          return matchDate.toDateString() === tomorrow.toDateString();
        }
        if (dateFilter === "week") {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          return matchDate >= today && matchDate <= weekFromNow;
        }
        if (dateFilter === "custom" && customDate) {
          const sel = new Date(customDate);
          return (
            matchDate.getFullYear() === sel.getFullYear() &&
            matchDate.getMonth() === sel.getMonth() &&
            matchDate.getDate() === sel.getDate()
          );
        }
        return true;
      });
    }
    return matches;
  }, [data.upcomingMatches, search, dateFilter, customDate]);

  // Pagination
  const totalMatches = filteredMatches.length;
  const totalPages = Math.ceil(totalMatches / matchesPerPage);
  const pagedMatches = filteredMatches.slice(
    (currentPage - 1) * matchesPerPage,
    currentPage * matchesPerPage
  );

  // Autocomplete logic
  useEffect(() => {
    if (search.length >= 2) {
      setSuggestions(
        allTeams.filter((t) =>
          t.toLowerCase().includes(search.trim().toLowerCase())
        ).slice(0, 8)
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    setSelectedSuggestion(-1);
  }, [search, allTeams]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
    if (e.target.value !== "custom") setCustomDate("");
  };
  const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
  };
  const handleSuggestionClick = (team: string) => {
    setSearch(team);
    setShowSuggestions(false);
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      setSelectedSuggestion((s) => Math.min(s + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedSuggestion((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && selectedSuggestion >= 0) {
      setSearch(suggestions[selectedSuggestion]);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };


  // Pagination
  const changePage = (delta: number) => {
    setCurrentPage((p) => Math.max(1, Math.min(totalPages, p + delta)));
  };

  // Show match details (modal with detailed analysis)
  const showMatchDetails = (id: number) => {
    const match = (data.upcomingMatches || []).find((m) => m.id === id);
    setModalMatch(match || null);
  };

  // Modal close handler
  const closeModal = () => setModalMatch(null);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero banner */}
      <section
        className="hero-wrap hero-wrap-2 d-flex align-items-center"
        style={{
          backgroundImage: "url('/user/images/event3.png')",
          height: 400,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-center align-items-end" style={{ height: 400 }}>
            <div className="col-md-9 text-center text-white">
              <p className="breadcrumbs mb-0">
                <span className="mr-2">
                  <a href="/sportify" className="text-white-50">
                    Trang Chủ <i className="fa fa-chevron-right"></i>
                  </a>
                </span>
                <span>Dự đoán kết quả <i className="fa fa-chevron-right"></i></span>
              </p>
              <h2 className="mb-0 bread font-weight-bold">Dự đoán kết quả</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section py-5">
        <div className="container">
          {/* Title */}
          <div className="row justify-content-center pb-4 mb-3">
            <div className="col-md-8 text-center">
              <h2 className="font-weight-bold">Dự đoán kết quả trận đấu</h2>
              <p className="text-muted">Sử dụng AI và dữ liệu thống kê để dự đoán kết quả các trận đấu bóng đá</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <form className="row g-3 align-items-end">
                    <div className="col-md-6">
                      <label htmlFor="searchInput" className="form-label font-weight-bold">
                        <i className="fa fa-search mr-2"></i>Tìm kiếm trận đấu
                      </label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          id="searchInput"
                          placeholder="Nhập tên đội bóng..."
                          autoComplete="off"
                          value={search}
                          onChange={handleSearchChange}
                          onFocus={() => setShowSuggestions(search.length >= 2)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          onKeyDown={handleSearchKeyDown}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000 }}>
                            {suggestions.map((team, idx) => (
                              <button
                                type="button"
                                key={team}
                                className={
                                  "list-group-item list-group-item-action" +
                                  (selectedSuggestion === idx ? " active" : "")
                                }
                                onMouseDown={() => handleSuggestionClick(team)}
                              >
                                {team}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="dateFilter" className="form-label font-weight-bold">Lọc theo ngày</label>
                      <select
                        className="form-control"
                        id="dateFilter"
                        value={dateFilter}
                        onChange={handleDateFilter}
                      >
                        <option value="all">Tất cả ngày</option>
                        <option value="today">Hôm nay</option>
                        <option value="tomorrow">Ngày mai</option>
                        <option value="week">Tuần này</option>
                        <option value="custom">Chọn ngày cụ thể</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      {dateFilter === "custom" && (
                        <div>
                          <label htmlFor="customDatePicker" className="form-label font-weight-bold">Chọn ngày</label>
                          <div className="input-group">
                            <input
                              type="date"
                              className="form-control"
                              id="customDatePicker"
                              value={customDate}
                              onChange={handleCustomDate}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setCustomDate("")}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                  <div className="row mt-3">
                    <div className="col text-center">
                      <span className="text-muted">
                        Hiển thị <span id="matchCount">{totalMatches}</span> trận đấu
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matches */}
          <div className="row" id="matchesContainer">
            {loading && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <h4>Đang tải dữ liệu trận đấu...</h4>
                  <p>Hệ thống đang kết nối với Football-Data.org API để lấy dữ liệu mới nhất</p>
                </div>
              </div>
            )}
            {!loading && pagedMatches.length === 0 && (
              <div className="col-12">
                <div className="alert alert-warning text-center">
                  <h5>
                    <i className="fa fa-search mr-2"></i>Không tìm thấy trận đấu nào
                  </h5>
                  <p>
                    Không có kết quả cho "{search}"{" "}
                    {dateFilter !== "all" && (
                      <>trong {dateFilter === "today"
                        ? "hôm nay"
                        : dateFilter === "tomorrow"
                        ? "ngày mai"
                        : dateFilter === "week"
                        ? "tuần này"
                        : customDate
                        ? customDate
                        : ""}</>
                    )}
                  </p>
                  <p>
                    <small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác</small>
                  </p>
                </div>
              </div>
            )}
            {pagedMatches.map((match) => (
              <div
                key={match.id}
                className="col-md-6 mb-4"
                data-home-team={match.homeTeam}
                data-away-team={match.awayTeam}
                data-date={match.date}
                data-confidence={match.aiConfidence || 0}
              >
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="row align-items-center mb-3">
                      <div className="col-4 text-center">
                        <img
                          src={match.homeTeamLogo || defaultTeamLogo}
                          alt={match.homeTeam}
                          className="img-fluid rounded-circle border border-secondary mb-2"
                          loading="lazy"
                          onError={(e) => ((e.target as HTMLImageElement).src = defaultTeamLogo)}
                          style={{ width: 56, height: 56, objectFit: "cover", background: "#fff" }}
                        />
                        <h6 className="font-weight-bold mt-2">{match.homeTeam || "Home Team"}</h6>
                      </div>
                      <div className="col-4 text-center">
                        <h4 className="text-primary font-weight-bold mb-1">VS</h4>
                        <small className="text-muted d-block mb-1">
                          <i className="fa fa-clock mr-1"></i>
                          {(match.time || "20:00") + " - " + (match.date || "2024-09-15")}
                        </small>
                        <span className="badge bg-info mb-1">
                          {match.competition || "Premier League"}
                        </span>
                        <br />
                        {match.predictedScore && (
                          <span className="badge bg-success font-weight-bold mt-1">
                            AI: {match.predictedScore}
                          </span>
                        )}
                      </div>
                      <div className="col-4 text-center">
                        <img
                          src={match.awayTeamLogo || defaultTeamLogo}
                          alt={match.awayTeam}
                          className="img-fluid rounded-circle border border-secondary mb-2"
                          loading="lazy"
                          onError={(e) => ((e.target as HTMLImageElement).src = defaultTeamLogo)}
                          style={{ width: 56, height: 56, objectFit: "cover", background: "#fff" }}
                        />
                        <h6 className="font-weight-bold mt-2">{match.awayTeam || "Away Team"}</h6>
                      </div>
                    </div>
                    <div className="row text-center mb-2">
                      <div className="col-4">
                        <small className="text-success font-weight-bold">Thắng</small>
                        <br />
                        <span className="badge bg-success px-3 py-2">
                          {match.homeWinProbability ?? 35}%
                        </span>
                      </div>
                      <div className="col-4">
                        <small className="text-warning font-weight-bold">Hòa</small>
                        <br />
                        <span className="badge bg-warning text-dark px-3 py-2">
                          {match.drawProbability ?? 30}%
                        </span>
                      </div>
                      <div className="col-4">
                        <small className="text-info font-weight-bold">Thắng</small>
                        <br />
                        <span className="badge bg-info px-3 py-2">
                          {match.awayWinProbability ?? 35}%
                        </span>
                      </div>
                    </div>
                    {match.aiAnalysis && (
                      <div className="alert alert-light py-2 px-3 text-muted text-center mb-2">
                        <small>{match.aiAnalysis}</small>
                      </div>
                    )}
                    {match.recommendation && (
                      <div className="alert alert-info py-2 px-3 text-center mb-2">
                        <small className="font-weight-bold">
                          {match.recommendation}
                        </small>
                      </div>
                    )}
                    <div className="text-center mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm font-weight-bold"
                        onClick={() => showMatchDetails(match.id)}
                      >
                        Xem chi tiết{" "}
                        {match.aiConfidence && (
                          <span className="badge bg-light text-dark ml-1">
                            ({match.aiConfidence}%)
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-4" id="paginationContainer">
              <div className="col-12 text-center">
                <nav aria-label="Match pagination">
                  <ul className="pagination justify-content-center">
                    <li className={"page-item" + (currentPage === 1 ? " disabled" : "")}>
                      <button className="page-link" onClick={() => changePage(-1)}>
                        Trước
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">{currentPage}</span>
                    </li>
                    <li className={"page-item" + (currentPage === totalPages ? " disabled" : "")}>
                      <button className="page-link" onClick={() => changePage(1)}>
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
                <small className="text-muted">
                  Hiển thị {(currentPage - 1) * matchesPerPage + 1} -{" "}
                  {Math.min(currentPage * matchesPerPage, totalMatches)} trong tổng số{" "}
                  {totalMatches} trận đấu
                </small>
              </div>
            </div>
          )}

          {/* API Info */}
          {data.apiInfo && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <div className="alert alert-success">
                  <h5>
                    <i className="fa fa-check-circle mr-2"></i>
                    Football-Data.org API + AI Engine Hoạt Động!
                  </h5>
                  <p className="mb-2">{data.apiInfo}</p>
                  <ul className="mb-0 text-left">
                    <li>
                      <strong>Football-Data.org:</strong> Lịch thi đấu Premier League chính thức
                    </li>
                    <li>
                      <strong>AI Prediction Engine:</strong> Phân tích thông minh dựa trên sức mạnh đội bóng
                    </li>
                    <li>
                      <strong>Real-time Data:</strong> Cập nhật liên tục từ API
                    </li>
                    <li>
                      <strong>Confidence Score:</strong> Đánh giá độ tin cậy của dự đoán
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* API Status Section */}
          <div className="row mt-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <i className="fa fa-server fa-2x text-success mb-2"></i>
                  <h6>Football-Data.org API</h6>
                  <small className="text-success">✓ Tích hợp hoàn tất</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <i className="fa fa-brain fa-2x text-success mb-2"></i>
                  <h6>AI Prediction Engine</h6>
                  <small className="text-success">✓ Đang hoạt động</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-0 shadow-sm">
                <div className="card-body">
                  <i className="fa fa-chart-line fa-2x text-success mb-2"></i>
                  <h6>Match Analysis</h6>
                  <small className="text-success">✓ Real-time predictions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Details Modal */}
      {modalMatch && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fa fa-chart-line mr-2"></i>
                  Phân tích chi tiết: {modalMatch.homeTeam} vs {modalMatch.awayTeam}
                </h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {/* Match Info */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="font-weight-bold"><i className="fa fa-calendar mr-2"></i>Thông tin trận đấu</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0 py-1"><strong>Ngày:</strong> {modalMatch.date}</li>
                      <li className="list-group-item px-0 py-1"><strong>Giờ:</strong> {modalMatch.time}</li>
                      <li className="list-group-item px-0 py-1"><strong>Giải đấu:</strong> {modalMatch.competition}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="font-weight-bold"><i className="fa fa-trophy mr-2"></i>Dự đoán AI</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item px-0 py-1">
                        <strong>Tỷ số dự đoán:</strong>{" "}
                        <span className="badge bg-success">{modalMatch.predictedScore}</span>
                      </li>
                      <li className="list-group-item px-0 py-1">
                        <strong>Độ tin cậy:</strong>{" "}
                        <span className="badge bg-info">{modalMatch.aiConfidence}%</span>
                      </li>
                      <li className="list-group-item px-0 py-1">
                        <strong>Khuyến nghị:</strong> {modalMatch.recommendation}
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Probabilities */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="font-weight-bold"><i className="fa fa-percentage mr-2"></i>Xác suất kết quả</h6>
                    <div className="progress mb-2" style={{ height: 28 }}>
                      <div className="progress-bar bg-success font-weight-bold" style={{ width: `${modalMatch.homeWinProbability}%` }}>
                        {modalMatch.homeWinProbability}% Thắng
                      </div>
                    </div>
                    <div className="progress mb-2" style={{ height: 28 }}>
                      <div className="progress-bar bg-warning text-dark font-weight-bold" style={{ width: `${modalMatch.drawProbability}%` }}>
                        {modalMatch.drawProbability}% Hòa
                      </div>
                    </div>
                    <div className="progress mb-2" style={{ height: 28 }}>
                      <div className="progress-bar bg-info font-weight-bold" style={{ width: `${modalMatch.awayWinProbability}%` }}>
                        {modalMatch.awayWinProbability}% Thắng
                      </div>
                    </div>
                  </div>
                </div>
                {/* AI Analysis */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h6 className="font-weight-bold"><i className="fa fa-brain mr-2"></i>Phân tích AI</h6>
                    <div className="alert alert-info">
                      <p className="mb-1"><strong>{modalMatch.aiAnalysis}</strong></p>
                      <p className="mb-0"><strong>Khuyến nghị:</strong> {modalMatch.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ...existing code for footer nếu dùng Layout... */}
    </div>
  );
};

export default FootballPredictionPage;
