import React, { useState } from 'react';
import { validateSignup } from '../../helper/validateSignup';

export default function Register() {
	// Signup fields required by API
	const [firstnameSignUp, setFirstnameSignUp] = useState('');
	const [lastnameSignUp, setLastnameSignUp] = useState('');
	const [usernameSignUp, setUsernameSignUp] = useState('');
	const [passwordSignUp, setPasswordSignUp] = useState('');
	const [phoneSignUp, setPhoneSignUp] = useState('');
	const [genderSignUp, setGenderSignUp] = useState(false);
	const [addressSignUp, setAddressSignUp] = useState('');
	const [emailSignUp, setEmailSignUp] = useState('');

	// UI state
	const [signupResult, setSignupResult] = useState<string | null>(null);

	const handleSignupChange = (field: string, value: any) => {
		switch (field) {
			case 'firstname':
				setFirstnameSignUp(value);
				break;
			case 'lastname':
				setLastnameSignUp(value);
				break;
			case 'username':
				setUsernameSignUp(value);
				break;
			case 'passwords':
			case 'password':
				setPasswordSignUp(value);
				break;
			case 'phone':
				setPhoneSignUp(value);
				break;
			case 'gender':
				setGenderSignUp(Boolean(value));
				break;
			case 'address':
				setAddressSignUp(value);
				break;
			case 'email':
				setEmailSignUp(value);
				break;
			default:
				break;
		}

	};

	const submitSignup = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		// basic required-fields validation
		const error = validateSignup({
			username: usernameSignUp,
			password: passwordSignUp,
			firstname: firstnameSignUp,
			lastname: lastnameSignUp,
			phone: phoneSignUp,
			email: emailSignUp,
			address: addressSignUp,
			gender: genderSignUp,
		});

		if (error) {

			setSignupResult(error);
			setNotification(error);
			return;
		}

		try {
			const payload = {
				firstname: firstnameSignUp,
				lastname: lastnameSignUp,
				username: usernameSignUp,
				password: passwordSignUp,
				phone: phoneSignUp,
				gender: genderSignUp,
				address: addressSignUp,
				email: emailSignUp
			};

			console.log('Signup payload:', payload);
			const res = await fetch('http://localhost:8081/api/sportify/signup/process', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			setSignupResult('Signup successful');
			setNotification('Đăng ký thành công');
		} catch (err: any) {
			setSignupResult(`Signup failed: ${err.message}`);
			setNotification('Đăng ký thất bại');
		}
	};

	return (
		<div className="min-vh-100 d-flex align-items-center bg-light py-5">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-10 col-lg-8 col-xl-7">
						<div className="card border-0 shadow-lg">
							<div className="card-body p-5">
								<div className="text-center mb-4">
									<h2 className="h3 fw-bold text-primary">Đăng ký tài khoản</h2>
									<p className="text-muted">Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi</p>
								</div>

								{signupResult && (
									<div className={`alert ${signupResult.includes('successful') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
										<i className={`fa ${signupResult.includes('successful') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
										{signupResult}
									</div>
								)}

								<form onSubmit={submitSignup}>
									<div className="row g-3">
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="username"
													value={usernameSignUp} 
													onChange={e => handleSignupChange('username', e.target.value)} 
													placeholder="Tên đăng nhập" 
													required
												/>
												<label htmlFor="username">
													<i className="fa fa-user me-2"></i>Tên đăng nhập
												</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="password"
													type="password"
													value={passwordSignUp} 
													onChange={e => handleSignupChange('passwords', e.target.value)} 
													placeholder="Mật khẩu" 
													required
												/>
												<label htmlFor="password">
													<i className="fa fa-lock me-2"></i>Mật khẩu
												</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="firstname"
													value={firstnameSignUp} 
													onChange={e => handleSignupChange('firstname', e.target.value)} 
													placeholder="Họ" 
													required
												/>
												<label htmlFor="firstname">
													<i className="fa fa-id-card me-2"></i>Họ
												</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="lastname"
													value={lastnameSignUp} 
													onChange={e => handleSignupChange('lastname', e.target.value)} 
													placeholder="Tên" 
													required
												/>
												<label htmlFor="lastname">
													<i className="fa fa-id-card me-2"></i>Tên
												</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="phone"
													type="tel"
													value={phoneSignUp} 
													onChange={e => handleSignupChange('phone', e.target.value)} 
													placeholder="Số điện thoại" 
													required
												/>
												<label htmlFor="phone">
													<i className="fa fa-phone me-2"></i>Số điện thoại
												</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="email"
													type="email"
													value={emailSignUp} 
													onChange={e => handleSignupChange('email', e.target.value)} 
													placeholder="Email" 
													required
												/>
												<label htmlFor="email">
													<i className="fa fa-envelope me-2"></i>Email
												</label>
											</div>
										</div>
										<div className="col-md-8">
											<div className="form-floating">
												<input 
													className="form-control" 
													id="address"
													value={addressSignUp} 
													onChange={e => handleSignupChange('address', e.target.value)} 
													placeholder="Địa chỉ" 
													required
												/>
												<label htmlFor="address">
													<i className="fa fa-map-marker-alt me-2"></i>Địa chỉ
												</label>
											</div>
										</div>
										<div className="col-md-4">
											<div className="form-floating">
												<select 
													className="form-select" 
													id="gender"
													value={genderSignUp ? 'true' : 'false'} 
													onChange={e => handleSignupChange('gender', e.target.value === 'true')}
												>
													<option value="false">Nữ</option>
													<option value="true">Nam</option>
												</select>
												<label htmlFor="gender">
													<i className="fa fa-venus-mars me-2"></i>Giới tính
												</label>
											</div>
										</div>
									</div>

									<div className="d-grid gap-2 mt-4">
										<button className="btn btn-primary btn-lg fw-medium" type="submit">
											<i className="fa fa-user-plus me-2"></i>Đăng ký tài khoản
										</button>
									</div>

									<div className="text-center mt-4">
										<div className="border-top pt-4">
											<p className="text-muted mb-0">
												Đã có tài khoản? 
												<a href="/login" className="text-decoration-none fw-medium ms-1">
													Đăng nhập ngay
												</a>
											</p>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
