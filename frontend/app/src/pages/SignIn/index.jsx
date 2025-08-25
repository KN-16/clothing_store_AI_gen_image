// export default SignIn;
import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaUser, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import useSignIn from "./useSignIn";

const SignIn = () => {
  const {
    form,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleForgotPassword,
    handleSocialLogin,
  } = useSignIn();

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đăng nhập</h2>

        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>Tên đăng nhập</label>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}><FaUser /></span>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder="Nhập tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            disabled={loading}
          />
        </div>

        <label className={styles.label}>Mật khẩu</label>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}><FaLock /></span>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <div className={styles.forgot}>
          <button
            type="button"
            className={styles.forgotBtn}
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Quên mật khẩu ?
          </button>
        </div>

        <button className={styles.loginBtn} type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className={styles.or}>Đăng nhập bằng</div>
        <div className={styles.socials}>
          <button type="button" onClick={() => handleSocialLogin("facebook")} className={styles.socialBtn}>
            <FaFacebookF />
          </button>
          <button type="button" onClick={() => handleSocialLogin("twitter")} className={styles.socialBtn}>
            <FaTwitter />
          </button>
          <button type="button" onClick={() => handleSocialLogin("google")} className={styles.socialBtn}>
            <FaGoogle />
          </button>
        </div>
        <Link to="/signup" className={styles.signupBtn}>Đăng ký</Link>
      </form>
    </div>
  );
};

export default SignIn;