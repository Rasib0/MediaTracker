import React from 'react'

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
        <div className="sidebar-item-1"> item 1</div>
        <div className="sidebar-item-1"> item 2</div>
        <div className="sidebar-item-1"> item 3</div>
    <style jsx>{`          
        .sidebar {
            width: 16vw;
            height: 100vh;
            background: rgba(0, 250, 0, 0.05);
        }`}
    </style>
  </div>

  )
}

export default Sidebar;