import { useState, useRef, useEffect } from "react";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-btn"
        onClick={() => setOpen(!open)}
      >
        PK
      </button>

      {open && (
        <div className="profile-dropdown">
          <button>My Profile</button>
          <button>Settings</button>
          <button>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;