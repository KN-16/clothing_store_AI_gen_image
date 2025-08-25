import React from 'react';
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Thông tin công ty */}
        <div className="footer-section company-info">
          <h4>About Us</h4>
          <p>We are a leading company offering amazing services. Serving clients globally with expertise and passion.</p>
          <address>
            <strong>Head Office:</strong><br />
            123 Business Avenue, City, Country<br />
            <strong>Email:</strong> info@company.com<br />
            <strong>Phone:</strong> +123 456 7890
          </address>
        </div>

        {/* Liên kết quan trọng */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <ul>
            <li><a href="#" target="_blank"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="#" target="_blank"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="#" target="_blank"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="#" target="_blank"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
          </ul>
        </div>

        {/* Đăng ký bản tin */}
        <div className="footer-section newsletter">
          <h4>Subscribe to our Newsletter</h4>
          <form action="/subscribe" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Thông tin bản quyền */}
      <div className="footer-bottom">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
        <p>Designed with <span className="heart">&#9829;</span> by Your Company</p>
      </div>
    </footer>
  );
}
