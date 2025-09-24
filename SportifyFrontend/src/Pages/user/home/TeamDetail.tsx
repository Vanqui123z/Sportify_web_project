import React, {type  FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getImageUrl from "../../../utils/getImageUrl";

type TeamRow = any[]; // raw array from API
type Team = {
	id: number;
	sportTypeId?: string;
	name?: string;
	capacity?: number;
	image?: string;
	contact?: string;
	motto?: string;
	bossUsername?: string;
	createdAt?: string;
	sportName?: string;
	membersCount?: number;
	bossFirstName?: string;
	bossLastName?: string;
};

const mapRowToTeam = (row: TeamRow): Team => ({
	id: row[0],
	sportTypeId: row[1],
	name: row[2],
	capacity: row[3],
	image: row[4],
	contact: row[5],
	motto: row[6],
	bossUsername: row[7],
	createdAt: row[8],
	sportName: row[9],
	membersCount: row[10],
	bossFirstName: row[11],
	bossLastName: row[12],
});

const TeamDetail: FC<{ teamIdProp?: string }> = ({ teamIdProp }) => {
	const params = useParams<{ teamId?: string }>();
	const teamId = teamIdProp ?? params.teamId ?? "";
	const [team, setTeam] = useState<Team | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!teamId) {
			setError("No teamId provided");
			setLoading(false);
			return;
		}
		const url = `http://localhost:8081/api/user/team/${teamId}`;
		setLoading(true);
		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			})
			.then((data) => {
				// API returns { teams: [ [...] , ... ] }
				if (data && Array.isArray(data.teams) && data.teams.length > 0) {
					// pick first team (server may return multiple rows)
					const t = mapRowToTeam(data.teams[0]);
					setTeam(t);
				} else {
					setError("Team not found");
				}
			})
			.catch((err) => {
				setError(err.message || "Fetch error");
			})
			.finally(() => setLoading(false));
	}, [teamId]);

	if (loading) return <div className="container py-5">Loading...</div>;
	if (error) return <div className="container py-5 text-danger">{error}</div>;
	if (!team) return <div className="container py-5">No team data</div>;

	return (
		<div>
			{/* Hero (kept visual, header/footer removed) */}
			<section
				className="hero-wrap hero-wrap-2"
				style={{ backgroundImage: "url('/user/images/bg-team.png')" }}
				data-stellar-background-ratio="0.5"
			>
				<div className="overlay"></div>
				<div className="container">
					<div className="row no-gutters slider-text align-items-end justify-content-center">
						<div className="col-md-9 ftco-animate mb-5 text-center">
							<p className="breadcrumbs mb-0">
								<span className="mr-2">
									<a href="/">Home <i className="fa fa-chevron-right"></i></a>
								</span>
								<span className="mr-2">
									<a href="/team">Team <i className="fa fa-chevron-right"></i></a>
								</span>
								<span>Team Single <i className="fa fa-chevron-right"></i></span>
							</p>
							<h2 className="mb-0 bread">Team Single</h2>
						</div>
					</div>
				</div>
			</section>

			{/* Main content */}
			<section className="ftco-section ftco-degree-">
				<div className="container">
					<div className="row">
						<div className="col-md-12 row d-flex">
							<div className="col-lg-12 d-flex align-items-stretch ftco-animate">
								<div className="blog-entry col-md-12 d-md-flex">
									{/* team image */}
									<img
										className="block-20 img bg-dark block-19 rounded"
										src={team.image ? getImageUrl(team.image) : "/user/images/noavatar.jpg"}
										alt={team.name || "Team image"}
									/>
									<div className="ml-5 text p-4 bg-light d-flex flex-column">
										<h3 className="heading" style={{ color: "#2E7D32", fontWeight: "bold" }}>
											{team.name}
										</h3>
										<div className="meta">
											<p className="fa fa-calendar"></p>
											<span>{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "-"}</span>
										</div>

										<div className="d-flex ">
											<p className="lable_team">Thành viên:</p>
											<p style={{ marginRight: 5 }}>{team.membersCount ?? "-"}</p>
											<p style={{ marginRight: 5 }}>/</p>
											<p style={{ marginRight: 5 }}>{team.capacity ?? "-"}</p>
										</div>

										<div className="d-flex">
											<p className="lable_team">Môn thể thao :</p>
											<p>{team.sportName ?? "-"}</p>
										</div>

										<div className="d-flex">
											<p className="lable_team">Liên hệ :</p>
											<p>{team.contact ?? "-"}</p>
										</div>

										<div className="d-flex">
											<p style={{ fontStyle: "italic" }}>"{team.motto ?? ""}"</p>
										</div>

										<div className="submit-section align-self-end mt-auto">
											{/* Simple action button placeholder */}
											<button className="btn btn-success">Rời Team</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Members / waiting lists are not provided by this API response.
							Keep sections minimal — they can be expanded when a richer API is available. */}
					</div>
				</div>
			</section>
		</div>
	);
};

export default TeamDetail;