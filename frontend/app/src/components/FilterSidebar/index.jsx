import React from 'react';
import { Link } from 'react-router-dom';

const FilterSidebar = () => {
  return (
    <div className="filter-sidebar">
      <h3>Filter By</h3>
      <ul>
        <li>
          <Link to="/products/all">Tất cả sản phẩm</Link>
        </li>
        <li>
          <Link to="/products/ao">Áo</Link>
        </li>
        <li>
          <Link to="/products/quan">Quần</Link>
        </li>
        {/* Thêm các bộ lọc khác nếu cần */}
      </ul>
    </div>
  );
};

export default FilterSidebar;
