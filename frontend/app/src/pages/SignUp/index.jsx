// // File: src/pages/SignIn/index.jsx
// import { useSignUp } from './logic';
// import styles from './styles.module.css';
// import { useNavigate } from 'react-router-dom';
// import { FaFacebookF, FaTwitter, FaGoogle,FaUser,FaLock, FaEnvelope, FaPhone,FaAddressCard } from 'react-icons/fa';

// const SignUp = () => {
//   const { form, handleChange, handleSubmit,handleSocialLogin } = useSignUp();
//   const Navigate = useNavigate();

//   return (
//     <div className={styles.container}>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <h2 className={styles.title}>Sign Up</h2>
//         <label className={styles.label}>Full Name</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaUser /></span>
//           <input
//             className={styles.input}
//             type="text"
//             name="fullName"
//             placeholder="Enter your Full name"
//             value={form.fullName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <label className={styles.label}>Username</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaUser /></span>
//           <input
//             className={styles.input}
//             type="text"
//             name="username"
//             placeholder="Enter your username"
//             value={form.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <label className={styles.label}>Email</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaEnvelope /></span>
//           <input
//             className={styles.input}
//             type="Email"
//             name="email"
//             placeholder="Enter your email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <label className={styles.label}>Password</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaLock /></span>
//           <input
//             className={styles.input}
//             type="password"
//             name="password"
//             placeholder="Type your password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <label className={styles.label}>Phone number</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaPhone /></span>
//           <input
//             className={styles.input}
//             type="text"
//             name="phoneNumber"
//             placeholder="Enter your phone number"
//             value={form.phoneNumber}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <label className={styles.label}>Address</label>
//         <div className={styles.inputWrapper}>
//           <span className={styles.icon}><FaAddressCard /></span>
//           <input
//             className={styles.input}
//             type="text"
//             name="Address"
//             placeholder="Enter your Address"
//             value={form.Address}
//             onChange={handleChange}
//             required
//           />
   
//         </div>
//         <button className={styles.loginBtn} type="submit">SIGN UP</button>
//         <div className={styles.or} onClick={()=> Navigate('/signin')}>Chuyển sang trang đăng nhập</div>
//         <div className={styles.or}>Quick sign up using</div>
//         <div className={styles.socials}>
//           <button type="button" onClick={() => handleSocialLogin('facebook')} className={styles.socialBtn}>
//             <FaFacebookF />
//           </button>
//           <button type="button" onClick={() => handleSocialLogin('twitter')} className={styles.socialBtn}>
//             <FaTwitter />
//           </button>
//           <button type="button" onClick={() => handleSocialLogin('google')} className={styles.socialBtn}>
//             <FaGoogle />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

// File: src/pages/SignUp/index.jsx
import { useSignUp } from './logic';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { 
  FaFacebookF, FaTwitter, FaGoogle,
  FaUser, FaLock, FaEnvelope, FaPhone, FaAddressCard 
} from 'react-icons/fa';

const SignUp = () => {
  const { form, handleChange, handleSubmit, handleSocialLogin } = useSignUp();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đăng ký</h2>
        <p className={styles.subtitle}>Tham gia cùng chúng tôi!!</p>

        <div className={styles.field}>
          <FaUser className={styles.icon}/>
          <input
            type="text"
            name="fullName"
            placeholder="Nhập họ và tên"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <FaUser className={styles.icon}/>
          <input
            type="text"
            name="username"
            placeholder="Nhập tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            
          />
        </div>

        <div className={styles.field}>
          <FaEnvelope className={styles.icon}/>
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={form.email}
            onChange={handleChange}
            
          />
        </div>

        <div className={styles.field}>
          <FaLock className={styles.icon}/>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={handleChange}
            
          />
        </div>

        <div className={styles.field}>
          <FaPhone className={styles.icon}/>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Nhập số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            
          />
        </div>

        <div className={styles.field}>
          <FaAddressCard className={styles.icon}/>
          <input
            type="text"
            name="address"
            placeholder="Nhập địa chỉ"
            value={form.address}
            onChange={handleChange}
            
          />
        </div>

        <button className={styles.submitBtn} type="submit">
          Đăng ký
        </button>

        <p className={styles.switchText}>
          Đã có tài khoản?{" "}
          <span onClick={() => navigate('/login')} className={styles.link}>Đăng nhập</span>
        </p>

        <div className={styles.divider}>
          <span>Or sign up with</span>
        </div>

        <div className={styles.socials}>
          <button type="button" onClick={() => handleSocialLogin('facebook')}><FaFacebookF /></button>
          <button type="button" onClick={() => handleSocialLogin('twitter')}><FaTwitter /></button>
          <button type="button" onClick={() => handleSocialLogin('google')}><FaGoogle /></button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;