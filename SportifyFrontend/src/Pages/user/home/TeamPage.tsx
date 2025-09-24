import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "../../../components/user/CustomCard";
import getImageUrl from "../../../utils/getImageUrl";

interface SportType {
  sporttypeid: string;
  categoryname: string;
}

interface TeamItem {
  id: number;
  name: string;
  quantity?: number;
  maxQuantity?: number;
  avatar?: string;
  createdDate?: string;
  sport?: string;
  leader?: string;
  description?: string;
  contact?: string;
}

const sporttypeList: SportType[] = [
  { sporttypeid: "B01", categoryname: "Bóng đá" },
  { sporttypeid: "C01", categoryname: "Cầu lông" },
  { sporttypeid: "R01", categoryname: "Bóng rổ" },
  { sporttypeid: "T01", categoryname: "Tennis" },
];

const TeamPage: React.FC = () => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    newNameteam: "",
    newAvatar: null as File | null,
    newContact: "",
    newQuantity: "",
    newSporttypeid: "B01",
    newDescriptions: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchText, setSearchText] = useState("");
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleEnterTeam = async (team: TeamItem) => {
    console.log("Entering team:", team);
    try {
      const response = await fetch(`http://localhost:8081/api/user/team/teamdetail/${team.id}`,{
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
       

      const data = await response.json();

      if (data.success && data.message === "Bạn đang trong team") {
        // ✅ User đã trong team → chuyển hướng
        // navigate(`/sportify/team/detailteam/${team.id}`);
      } else {
        // ❌ Các trường hợp khác → hiện thông báo
        alert(data.message); 
        // hoặc dùng toast, modal,... tùy UI
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi kiểm tra team");
    }
  };

  // --- Helpers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, newAvatar: e.target.files[0] });
    }
  };


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.newNameteam) newErrors.newNameteam = "Tên không được để trống";
    if (!formData.newContact) newErrors.newContact = "Số liên hệ không được để trống";
    if (!formData.newQuantity) newErrors.newQuantity = "Số lượng không được để trống";
    if (!formData.newAvatar) newErrors.newAvatar = "Vui lòng chọn ảnh đại diện";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // filter
  const handleFilter = (sporttypeid: string | null) => {
  const url = sporttypeid 
    ? `http://localhost:8081/api/user/team/${sporttypeid}`
    : 'http://localhost:8081/api/user/team/all'; // nếu muốn "Tất cả"

  fetch(url, {
    method: 'GET',
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      const rawTeams = Array.isArray(data.teams) ? data.teams : [];
      setTeams(rawTeams.map(parseTeamArray));
    })
    .catch(err => console.error('Fetch error:', err));
};

  // --- Submit create team ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("newNameteam", formData.newNameteam);
    if (formData.newAvatar) data.append("newAvatar", formData.newAvatar);
    data.append("newContact", formData.newContact);
    data.append("newQuantity", formData.newQuantity);
    data.append("newSporttypeid", formData.newSporttypeid);
    data.append("newDescriptions", formData.newDescriptions);
    console.log("formData.newSporttypeid:", formData.newSporttypeid);
    try {
      const res = await fetch("http://localhost:8081/api/user/team/createTeam", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setShowModal(false);
      fetchTeams(searchText); // Reload
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Fetch teams ---
  const parseTeamArray = (arr: any[]): TeamItem => {
    const id = Number(arr[0]) || 0;
    return {
      id,
      name: String(arr[2] ?? arr[1] ?? ""),
      quantity: Number(arr[3] ?? 0),
      avatar: String(arr[4] ?? ""),
      contact: String(arr[5] ?? ""),
      description: String(arr[6] ?? ""),
      createdDate: String(arr[8] ?? ""),
      sport: String(arr[9] ?? ""),
      maxQuantity: Number(arr[10] ?? 0),
      leader: String(arr[11] ?? arr[7] ?? ""),
    };
  };

  const fetchTeams = async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8081/api/user/team", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      let rawTeams: any[] = [];
      if (data?.teams?.content && Array.isArray(data.teams.content)) rawTeams = data.teams.content;
      else if (data?.teams && Array.isArray(data.teams)) rawTeams = data.teams;
      else if (Array.isArray(data)) rawTeams = data;

      setTeams(rawTeams.map(parseTeamArray));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi khi tải dữ liệu");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      fetch('http://localhost:8081/api/user/team/search', {
        method: 'POST',
        body: JSON.stringify({ searchText: searchText }),
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {
          const rawTeams = Array.isArray(data.teams) ? data.teams : [];
          setTeams(rawTeams.map(parseTeamArray));
        })
        .catch(err => console.error('Fetch error:', err));
    } catch (error) {
      console.error('Error submitting search:', error);
    }
  };


  // --- Render ---
  return (
    <>
      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: "url('/user/images/bg-team.png')" }}
        data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2">
                  <a href="/sportify">Trang Chủ <i className="fa fa-chevron-right"></i></a>
                </span> 
                <span>
                  <a href="/sportify/team">Đội/Nhóm <i className="fa fa-chevron-right"></i></a>
                </span>
              </p>
              <h2 className="mb-0 bread">Đội/Nhóm</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          <div className="row">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-0 d-flex justify-content-center col-md-12">
              <input 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                name="searchText"
                className="form-control me-2 col-6" 
                type="search"
                placeholder="Tìm kiếm theo tên" 
                aria-label="Search"
              />
              <button className="btn btn-success col-2" type="submit">Search</button>
            </form>

            {/* Search Results Message */}
            <div className="d-flex justify-content-center col-md-12 mt-1">
              <div className="mr-4 col-md-8">
                {/* Search results message would go here */}
              </div>
            </div>

            <div className="row col-md-12 ml-5 mt-4">
              <div className="row col-md-12 mb-1">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="product-select">Lọc theo môn thể thao</h4>
                    <div className="dropdown filter">
                      <button className="btn btn-success dropdown-toggle col-md-8 mb-3"
                        type="button" 
                        id="dropdownMenuButton" 
                        data-toggle="dropdown"
                        aria-haspopup="true" 
                        aria-expanded="false">
                        Lọc
                      </button>
                      <div className="dropdown-menu filter-item" aria-labelledby="dropdownMenuButton">
                        <button 
                          type="button"
                          className="dropdown-item"
                          onClick={() => handleFilter(null)}
                        >
                          Tất cả
                        </button>
                        {sporttypeList.map((spt) => (
                          <button
                            key={spt.sporttypeid}
                            type="button"
                            className="dropdown-item"
                            onClick={() => handleFilter(spt.sporttypeid)}
                          >
                            {spt.categoryname}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-success col-2 pt-2 pb-2" 
                    type="button"
                    onClick={() => setShowModal(true)}>
                    Tạo đội
                  </button>
                </div>
              </div>

              {/* No Results Message */}
              <div className="col-md-12">
                {!loading && !error && teams.length === 0 && <div className="text-muted">Không có đội nào.</div>}
                {error && <div className="text-danger">{error}</div>}
              </div>

              {/* Create Team Modal */}
              {showModal && (
                <div className="col-12 addteam" id="createModal">
                  <div className="col-6" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Điền thông tin để tạo nhóm.</h5>
                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form className="row" onSubmit={handleSubmit}>
                          <div className="col-md-6 form-group">
                            <label>Tên nhóm:</label>
                            <input 
                              type="text"
                              className="form-control" 
                              name="newNameteam"
                              value={formData.newNameteam} 
                              onChange={handleChange}
                            />
                            {errors.newNameteam && <div className="error-message text-danger">{errors.newNameteam}</div>}
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Ảnh đại diện:</label>
                            <input 
                              type="file"
                              className="form-control" 
                              name="newAvatar"
                              onChange={handleFileChange}
                            />
                            {errors.newAvatar && <div className="error-message text-danger">{errors.newAvatar}</div>}
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Số liên hệ:</label>
                            <input 
                              type="text"
                              className="form-control" 
                              name="newContact"
                              value={formData.newContact} 
                              onChange={handleChange}
                            />
                            {errors.newContact && <div className="error-message text-danger">{errors.newContact}</div>}
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Số Lượng:</label>
                            <input 
                              type="number"
                              className="form-control" 
                              name="newQuantity"
                              value={formData.newQuantity} 
                              onChange={handleChange}
                            />
                            {errors.newQuantity && <div className="error-message text-danger">{errors.newQuantity}</div>}
                          </div>
                          <div className="form-group col-md-6">
                            <label>Môn thể thao:</label>
                            <select 
                              style={{ width: '100%' }}
                              className="custom-select form-control" 
                              name="newSporttypeid"
                              value={formData.newSporttypeid}
                              onChange={handleChange}
                            >
                              {sporttypeList.map((spt) => (
                                <option key={spt.sporttypeid} value={spt.sporttypeid}>
                                  {spt.categoryname}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Mô tả:</label>
                            <textarea 
                              className="form-control" 
                              name="newDescriptions"
                              rows={4}
                              value={formData.newDescriptions} 
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-12 modal-footer">
                            <button type="submit" className="btn btn-primary">Tạo</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Teams Grid */}
              <div className="col-md-12 row d-flex">
                {loading && <div className="text-center">Đang tải...</div>}
                {!loading && teams.map(team => (
                  <div key={team.id} className="col-lg-6 d-flex align-items-stretch">
                    <div className="blog-entry d-md-flex">
                      <img 
                        className="block-20 img bg-dark block-19"
                        src={team.avatar ? getImageUrl(team.avatar) : "/user/images/default.png"}
                        alt=""
                      />
                      <div className="text p-4 bg-light d-flex flex-column">
                        <h3 className="heading mb-3" style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                          <a href="#">{team.name}</a>
                        </h3>
                        <div className="d-flex">
                          <p className="lable_team">Ngày lập :</p>
                          <div className="meta">
                            <p className="fa fa-calendar"></p>
                            <span>{team.createdDate}</span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <p className="lable_team">Thành viên :</p>
                          <p style={{ marginRight: '5px' }}>{team.quantity}</p>
                          <p style={{ marginRight: '5px' }}>/</p>
                          <p style={{ marginRight: '5px' }}>{team.maxQuantity}</p>
                        </div>
                        <div className="d-flex">
                          <p className="lable_team">Môn thể thao :</p>
                          <p>{team.sport}</p>
                        </div>
                        <div className="d-flex">
                          <p className="lable_team">Đội trưởng :</p>
                          <p>{team.leader}</p>
                        </div>
                        <div className="d-flex">
                          <p className="limited-length" style={{ fontStyle: 'italic' }}>
                            {team.description}
                          </p>
                        </div>
                        <div className="submit-section align-self-end mt-auto">
                          <button 
                            className="btn btn-success"
                            onClick={() => handleEnterTeam(team)}
                          >
                            Vào Team
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;
