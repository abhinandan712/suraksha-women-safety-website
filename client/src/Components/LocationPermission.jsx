import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LocationPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocationPermission = async () => {
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        toast.error('Location not supported on this device');
        return;
      }

      // Request permission
      const permission = await navigator.permissions.query({name: 'geolocation'});
      
      if (permission.state === 'granted') {
        setHasPermission(true);
        toast.success('Location permission granted!');
      } else if (permission.state === 'prompt') {
        // Try to get location which will prompt for permission
        navigator.geolocation.getCurrentPosition(
          () => {
            setHasPermission(true);
            toast.success('Location permission granted!');
          },
          () => {
            toast.error('Location permission denied. Please enable in browser settings.');
          }
        );
      } else {
        toast.error('Location blocked. Please enable in browser settings.');
      }
    } catch (error) {
      toast.error('Please enable location manually in browser settings');
    }
  };

  return (
    <div className="alert alert-warning m-3">
      <h5>📍 Location Access Required</h5>
      <p>This app needs location access for emergency features.</p>
      
      {!hasPermission && (
        <>
          <button 
            className="btn btn-primary me-2" 
            onClick={requestLocationPermission}
          >
            Enable Location
          </button>
          
          <div className="mt-2">
            <small>
              <strong>If blocked:</strong><br/>
              1. Tap the lock icon next to URL<br/>
              2. Change Location from "Block" to "Allow"<br/>
              3. Refresh the page
            </small>
          </div>
        </>
      )}
      
      {hasPermission && (
        <div className="text-success">
          ✅ Location access enabled!
        </div>
      )}
    </div>
  );
};

export default LocationPermission;