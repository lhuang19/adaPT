/**
 *
 * localStorage design. (simple right now. we can add to it to cover features for included later
 *
 * Items: {adaPT_users}
 *
 * adaPT_users -- map. K=username, V=temporary value
 */
const loggedInStorage = "supervulnerabletoken";

// ignore for now?
function logout() {
  localStorage.removeItem(loggedInStorage);
}
// ignore for now?
function checkLoggedIn() {
  const data = localStorage.getItem(loggedInStorage);
  return data;
}

function addLoginToken(token) {
  localStorage.setItem(loggedInStorage, token);
}

export { addLoginToken, checkLoggedIn, logout };
