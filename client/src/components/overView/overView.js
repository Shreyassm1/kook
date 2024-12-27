import React, { useState, useEffect } from "react";
import useFetchData from "../../utils/useFetchData";
import "./overView.css";

const OverView = () => {
  const [canteens, setCanteens] = useState([]);

  const { data, isLoading, isError } = useFetchData(
    "http://localhost:8000/getCanteens"
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCanteens(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching data: {isError}</div>;
  }

  const handleClick = (canteenId) => {
    console.log("Canteen ID clicked:", canteenId);
    window.location.href = `http://localhost:3000/getMenu/${canteenId}`;
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
