import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "../../../components/user/CustomCard";

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
    <div className="container mt-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-3 d-flex justify-content-center">
        <input style={{ width: '50%' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm kiếm theo tên"
          className="form-control me-2 col-6"
        />
        <button className="btn btn-success col-2" type="submit">Search</button>
      </form>

      {/* Filter + create button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="dropdown">
          <button className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown">Lọc</button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleFilter(null)}
            >
              Tất cả
            </button>
            {sporttypeList.map((spt) => (
              <button
                key={spt.sporttypeid}
                className="dropdown-item"
                onClick={() => handleFilter(spt.sporttypeid)}
              >
                {spt.categoryname}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-success" onClick={() => setShowModal(true)}>Tạo đội</button>
      </div>

      {/* Modal create */}
      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Điền thông tin để tạo nhóm</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit} className="row">
                <div className="col-md-6 mb-2">
                  <label>Tên nhóm</label>
                  <input type="text" className="form-control" name="newNameteam" value={formData.newNameteam} onChange={handleChange} />
                  {errors.newNameteam && <div className="text-danger">{errors.newNameteam}</div>}
                </div>
                <div className="col-md-6 mb-2">
                  <label>Số liên hệ</label>
                  <input type="text" className="form-control" name="newContact" value={formData.newContact} onChange={handleChange} />
                  {errors.newContact && <div className="text-danger">{errors.newContact}</div>}
                </div>
                <div className="col-md-6 mb-2">
                  <label>Số lượng</label>
                  <input type="number" className="form-control" name="newQuantity" value={formData.newQuantity} onChange={handleChange} />
                  {errors.newQuantity && <div className="text-danger">{errors.newQuantity}</div>}
                </div>
                <div className="col-md-6 mb-2">
                  <label>Môn thể thao</label>
                  <select
                    name="newSporttypeid"
                    className="form-control"
                    value={formData.newSporttypeid} // giá trị state
                    onChange={handleChange}        // cập nhật state
                  >
                    <option value="B01">Bóng đá</option>
                    <option value="C01">Cầu lông</option>
                    <option value="R01">Bóng rổ</option>
                    <option value="T01">Tennis</option>
                  </select>
                </div>
                <div className="col-md-12 mb-2">
                  <label>Mô tả</label>
                  <textarea className="form-control" name="newDescriptions" value={formData.newDescriptions} onChange={handleChange} />
                </div>
                <div className="col-md-12 mb-2">
                  <label>Ảnh đại diện</label>
                  <input type="file" className="form-control" onChange={handleFileChange} />
                  {errors.newAvatar && <div className="text-danger">{errors.newAvatar}</div>}
                </div>
                <div className="col-md-12 text-end">
                  <button type="submit" className="btn btn-primary">Tạo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Teams list */}
      <div className="row mt-4">
        {loading && <div className="text-center">Đang tải...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && !error && teams.length === 0 && <div className="text-muted">Không có đội nào.</div>}

        {!loading && teams.map(team => (
          <div key={team.id} className="col-lg-6 col-md-6 mb-4">
            <CustomCard
              id={team.id}
              title={team.name}
              image={team.avatar ? `/user/images/${team.avatar}` : "/user/images/default.png"}
              badgeText={team.sport}
              badgeColor="bg-success"
              description={team.description || team.contact || undefined}
              extraInfo={
                <span>
                  {team.createdDate && <small>Ngày lập: {team.createdDate} • </small>}
                  {typeof team.quantity === "number" && typeof team.maxQuantity === "number" && (
                    <small>Thành viên: {team.quantity}/{team.maxQuantity}</small>
                  )}
                  {team.leader && <div>Đội trưởng: {team.leader}</div>}
                </span>
              }
              buttonText="Vào Team"
              buttonColor="btn-success"
              onClick={() => handleEnterTeam(team)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
