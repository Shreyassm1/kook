import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './overView.css';

const OverView = () => {
    const [canteens, setCanteens] = useState([]);

    useEffect(() => {
        console.log("useEffect triggered: fetching canteens...");
        fetchCanteens();
    }, []);

    const fetchCanteens = async () => {
        try {
            console.log("Fetching canteens from server...");
            const response = await fetch("http://localhost:8000/getCanteens");
            if (!response.ok) {
                throw new Error('Failed to fetch canteens');
            }
            console.log("Canteens fetched successfully.");
            const data = await response.json();
            console.log("Canteens data:", data);
            setCanteens(data);
        } catch (error) {
            console.error("Error fetching canteens:", error);
        }
    };

    const handleClick = (canteenId) => {
        console.log("Canteen ID clicked:", canteenId);
        window.location.href = `http://localhost:3000/getMenu/${canteenId}`;
    }

    console.log("Rendering OverView component...");

    return (
        <div className="max-width">
            <div className='title'>
                Tired of the ABHORRENT mess food? Let us Kook.
            </div>
            <div className='canteen-collections'>
                {canteens.map(canteen => (
                    <div className='canteen-cards' key={canteen._id} onClick={() => handleClick(canteen.canteenId)}>
                        <img src={canteen.canteenImage} alt={canteen.canteenName} className="canteen-image" />

                        <div className='canteen-name'>
                            {canteen.canteenName}
                        </div>
                        <div className='canteen-description'>
                            {canteen.canteenDescription}
                        </div>
                        <div className='canteen-location'>
                            {canteen.canteenLocation}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverView;
