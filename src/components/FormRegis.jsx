import React, { useState, useEffect } from 'react';

const FormRegis = () => {
  const [LoginMode, setLoginMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!LoginMode) {
      if (!formData.name.trim()) {
        newErrors.name = 'Tên không được để trống';
      } else if (formData.name.length < 8) {
        newErrors.name = 'Tên phải có ít nhất 8 ký tự';
      } else if (/\d/.test(formData.name)) {
        newErrors.name = 'Tên không được chứa số';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else if (!LoginMode && users.some(user => user.email === formData.email)) {
      newErrors.email = 'Email đã tồn tại';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (!LoginMode && !passwordRegex.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (LoginMode) {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        alert('Đăng nhập thành công! Xin chào ' + user.name);

      } else {
        setErrors({ login: 'Email hoặc mật khẩu không chính xác' });
      }
    } else {

      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      setUsers([...users, newUser]);
      alert('Đăng ký thành công!');
      setLoginMode(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img 
            src="https://www.sme-news.co.uk/wp-content/uploads/2021/11/Login.jpg"
            alt="Login illustration"
            className="img-fluid p-5"
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-50">
            <h2 className="mb-4 text-center">{LoginMode ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h2>
            <form onSubmit={handleSubmit}>
              {!LoginMode && (
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Your name'
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="emailexample@gmail.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {!LoginMode && (
                <div className="mb-3">
                  <label className="form-label">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Xác nhận mật khẩu"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              )}

              {LoginMode && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                   <label class="form-check-label" for="rememberMe">Lưu mật khẩu</label>
                </div>
              )}

              {errors.login && <div className="alert alert-danger">{errors.login}</div>}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                {LoginMode ? 'Đăng nhập' : 'Đăng ký'}
              </button>

              <div className="text-center">
                <span>
                  {LoginMode ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                </span>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => {
                    setLoginMode(!LoginMode);
                    setErrors({});
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      rememberMe: false
                    });
                  }}
                >
                  {LoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRegis;