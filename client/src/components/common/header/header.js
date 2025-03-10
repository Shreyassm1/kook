import "./header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "./logo.png";
import { logoutUser } from "../../../controllers/authCon";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../../utils/useFetchData";
const BASE_URLS = process.env.REACT_APP_BASE_URL_S;
// const BASE_URLC = "https://kook-six.vercel.app";
const Header = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchData(`${BASE_URLS}/getStudent`);

  const { userName, profilePicture } = data;
  if (isLoading) {
    return (
      <div>
        <h5>Loading...</h5>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="max-width">
        <div className="header">
          <img src={logo} alt="logo" className="header-logo" />
          <div className="header-right">
            <div className="header-location-search-box">
              <div className="location-box">
                <div className="absolute-centre">
                  <div className="location-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="location-icon-name">Prayagraj</div>
                </div>
                <div className="absolute-centre">
                  <div className="caret-icon">
                    <i className="fa-solid fa-caret-down"></i>
                  </div>
                </div>
              </div>
              <div className="separater"></div>
              <div className="header-search-box">
                <div className="search-icon">
                  <div className="absolute-centre">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                </div>
                <input
                  placeholder="Search for a canteen...."
                  className="search-input-box"
                />
              </div>
            </div>
            <div className="profile-box">
              <img
                srcSet="https://b.zmtcdn.com/web/assets/2267aec184e096c98c46a1565a5563661664945464.png?fit=around%7C100%3A100&crop=100%3A100%3B%2A%2C%2A"
                src={profilePicture}
                alt="DP"
                className="profile-img"
              />
              <div className="profile-name">
                <a href="/login">???</a>
              </div>
            </div>
            {/* <div className="cart-box">
              <div className="cart-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <div className="cart-text"></div>
            </div>
            <div className="logout-btn">
              <i className="fa-solid fa-sign-out"></i>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  const handleCart = () => {
    navigate("/cart");
  };

  const handleLogout = async (e) => {
    console.log("logout clicked");
    e.stopPropagation();
    const response = await logoutUser();
    if (!response.success) {
      console.error("Logout failed:", response.error);
      alert("Logout failed. Please try again later.");
    } else {
      navigate("/login");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const displayName = userName.split(" ")[0];

  return (
    <div className="max-width">
      <div className="header">
        <img src={logo} alt="logo" className="header-logo" />
        <div className="header-right">
          <div className="header-location-search-box">
            <div className="location-box">
              <div className="absolute-centre">
                <div className="location-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="location-icon-name">Prayagraj</div>
              </div>
              <div className="absolute-centre">
                <div className="caret-icon">
                  <i className="fa-solid fa-caret-down"></i>
                </div>
              </div>
            </div>
            <div className="separater"></div>
            <div className="header-search-box">
              <div className="search-icon">
                <div className="absolute-centre">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
              <input
                placeholder="Search for a canteen...."
                className="search-input-box"
              />
            </div>
          </div>
          <div className="profile-box">
            <img
              srcSet="https://b.zmtcdn.com/web/assets/2267aec184e096c98c46a1565a5563661664945464.png?fit=around%7C100%3A100&crop=100%3A100%3B%2A%2C%2A"
              src={profilePicture}
              alt="DP"
              className="profile-img"
            />
            <div className="profile-name" onClick={handleProfile}>
              {displayName}
            </div>
          </div>
          <div className="cart-box" onClick={handleCart}>
            <div className="cart-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
          </div>
          <div className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out"></i>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
