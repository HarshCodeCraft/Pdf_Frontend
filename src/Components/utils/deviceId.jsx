export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    const generateUUID = () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

    // Use crypto.randomUUID only if available
    deviceId = typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : generateUUID();

    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};
