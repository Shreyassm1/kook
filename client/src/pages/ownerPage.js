import React, { useState, useEffect } from 'react';
const OwnerPage = () => {
    const [canteenName, setCanteenName] = useState("");
    const [canteenDescription, setCanteenDescription] = useState("");
    const [canteenLocation, setCanteenLocation] = useState("");
    const [canteenImage, setCanteenImage] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const getToken = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        };
        getToken();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const apiKey = '363398383525658'; 
        const cloudName = 'dh4hs9xvf';
        const uploadPreset = 'ml_default';
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
    
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload?upload_preset=${uploadPreset}&api_key=${apiKey}`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                setCanteenImage(data.secure_url); 
                console.log('Image uploaded successfully:', data);
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const requestData = {
                canteenName,
                canteenDescription,
                canteenLocation,
                canteenImage
            };

            const response = await fetch('http://localhost:8000/ownerPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit canteen data');
            }

            console.log('Canteen data submitted successfully');

            setCanteenName("");
            setCanteenDescription("");
            setCanteenLocation("");
            setCanteenImage("");

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="canteenName">
                    <input 
                        type="text" 
                        placeholder="Enter Canteen Name"
                        value={canteenName}
                        onChange={(event) => setCanteenName(event.target.value)}
                        required
                    />
                </div>
                <div className="canteenDescription">
                    <input 
                        type="text" 
                        placeholder="Enter Canteen Description"
                        value={canteenDescription}
                        onChange={(event) => setCanteenDescription(event.target.value)}
                        required
                    />
                </div>
                <div className="canteenLocation">
                    <input 
                        type="text" 
                        placeholder="Enter Canteen Location"
                        value={canteenLocation}
                        onChange={(event) => setCanteenLocation(event.target.value)}
                        required
                    />
                </div>
                <div className="canteenImage">
                    <input 
                        type="file" 
                        onChange={handleImageUpload}
                        accept="image/*"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <a href='/ownerM'>Upload Menu</a>
        </div>
    );
};
export default OwnerPage;
