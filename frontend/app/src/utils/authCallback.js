let logoutCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

export const triggerLogout = () => {
  if (logoutCallback) logoutCallback();
};