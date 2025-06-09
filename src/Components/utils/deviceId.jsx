// utils/deviceId.js
export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // or use uuid or nanoid
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};
