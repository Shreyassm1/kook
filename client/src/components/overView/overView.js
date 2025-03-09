import React, { useState, useEffect } from "react";
import useFetchData from "../../utils/useFetchData";
import { useNavigate } from "react-router-dom";
import "./overView.css";

const OverView = () => {
  const [canteens, setCanteens] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useFetchData(
    "https://kook-bqcr.onrender.com/getCanteens"
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCanteens(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <h5>Loading...</h5>
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <h1>You may not be logged in...</h1>
      </div>
    );
  }

  const handleClick = (canteenId) => {
    console.log("Canteen ID clicked:", canteenId);

    navigate(`/getMenu/${canteenId}`);
  };

  console.log("Rendering OverView component...");

  return (
    <div className="max-width">
      <div className="title">
        Tired of the ABHORRENT mess food? Let us Kook.
      </div>
      <div className="canteen-collections">
        {canteens.map((canteen) => (
          <div
            className="canteen-cards"
            key={canteen._id}
            onClick={() => handleClick(canteen.canteenId)}
          >
            <img
              src={canteen.canteenImage}
              alt={canteen.canteenName}
              className="canteen-image"
            />

            <div className="canteen-name">{canteen.canteenName}</div>
            <div className="canteen-description">
              {canteen.canteenDescription}
            </div>
            <div className="canteen-location">{canteen.canteenLocation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverView;
