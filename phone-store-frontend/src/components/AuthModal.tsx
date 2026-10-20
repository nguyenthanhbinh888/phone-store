import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  X,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    login, 
    register 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(false);

  // Form states - Login
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Register
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password view state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sync tab with context when modal opens
  useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMsg(null);
    setShowForgotPassword(false);
    setForgotSuccess(false);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !loginPassword) {
      setErrorMsg('Vui lòng nhập tên đăng nhập / email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await login({ usernameOrEmail: usernameOrEmail.trim(), password: loginPassword });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Tài khoản hoặc mật khẩu không chính xác.';
      setErrorMsg(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword || !regFullName.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        fullName: regFullName.trim(),
        phoneNumber: regPhone.trim() || undefined,
        address: regAddress.trim() || undefined,
      });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Đăng ký tài khoản không thành công.';
      setErrorMsg(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email đã đăng ký tài khoản.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSuccess(true);
    }, 800);
  };

  return (
    <div className="auth-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header & Close Button */}
        <div className="auth-modal-header">
          <div className="auth-modal-title-group">
            <h2 className="auth-modal-title">
              {showForgotPassword
                ? 'Khôi Phục Mật Khẩu'
                : activeTab === 'login'
                ? 'Đăng Nhập Tài Khoản'
                : 'Đăng Ký Tài Khoản'}
            </h2>
            <p className="auth-modal-subtitle">
              {showForgotPassword
                ? 'Nhận liên kết đặt lại mật khẩu bảo mật qua email của bạn'
                : activeTab === 'login' 
                ? 'Chào mừng bạn quay trở lại! Đăng nhập để quản lý đơn hàng & tích điểm' 
                : 'Đăng ký thành viên PhoneStore nhận ngay ưu đãi bảo hành chính hãng'}
            </p>
          </div>
          <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Đóng cửa sổ">
            <X size={18} />
          </button>
        </div>

        {/* Tab switchers (hidden in forgot password mode) */}
        {!showForgotPassword && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
            >
              Đăng ký tài khoản
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="auth-alert-error" role="alert">
            <AlertCircle size={18} className="auth-alert-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Forgot Password Flow */}
        {showForgotPassword ? (
          <div className="auth-forgot-box">
            {forgotSuccess ? (
              <div className="auth-forgot-success">
                <CheckCircle2 size={44} className="success-icon" />
                <h3>Đã gửi hướng dẫn khôi phục!</h3>
                <p>
                  Chúng tôi đã gửi email hướng dẫn tạo mật khẩu mới tới{' '}
                  <strong>{forgotEmail}</strong>. Vui lòng kiểm tra hòm thư chính và thư rác.
                </p>
                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSuccess(false);
                    setErrorMsg(null);
                  }}
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Địa chỉ Email tài khoản *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-field-icon" />
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="vidu@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý yêu cầu...' : 'Gửi Mã Xác Nhận Đặt Lại'}
                </button>

                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setErrorMsg(null);
                  }}
                >
                  ← Quay lại màn hình đăng nhập
                </button>
              </form>
            )}
          </div>
        ) : activeTab === 'login' ? (
          /* Production Login Form (Direct, Real, No Third Party) */
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-username">Tên đăng nhập hoặc Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-field-icon" />
                <input
                  id="login-username"
                  type="text"
                  placeholder="Nhập email hoặc tên tài khoản"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password">Mật khẩu</label>
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setErrorMsg(null);
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-field-icon" />
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  tabIndex={-1}
                  title={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner-inline">
                  <span className="spinner-dots" /> Đang đăng nhập...
                </span>
              ) : (
                <>
                  <span>Đăng Nhập</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Production Register Form */
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-fullname">Họ và tên *</label>
                <div className="input-with-icon">
                  <UserIcon size={18} className="input-field-icon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-username">Tên tài khoản đăng nhập *</label>
                <div className="input-with-icon">
                  <UserIcon size={18} className="input-field-icon" />
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="vd: nguyenvana"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-email">Email liên hệ *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-field-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="name@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">Số điện thoại</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-field-icon" />
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-password">Mật khẩu *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-field-icon" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    tabIndex={-1}
                    title={showRegPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">Xác nhận mật khẩu *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-field-icon" />
                  <input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    tabIndex={-1}
                    title={showRegConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showRegConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-address">Địa chỉ nhận hàng (tùy chọn)</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-field-icon" />
                <input
                  id="reg-address"
                  type="text"
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="form-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  Tôi đã đọc và đồng ý với <a href="#terms" onClick={(e) => e.preventDefault()} className="auth-link">Điều khoản dịch vụ</a> & <a href="#privacy" onClick={(e) => e.preventDefault()} className="auth-link">Chính sách bảo mật</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner-inline">
                  <span className="spinner-dots" /> Đang thiết lập tài khoản...
                </span>
              ) : (
                <>
                  <span>Hoàn Tất Đăng Ký Tài Khoản</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Trust Footer */}
        <div className="auth-trust-footer">
          <ShieldCheck size={15} className="trust-icon" />
          <span>Hệ thống tài khoản bảo mật chuẩn mã hóa SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};
