/**
 *
 * localStorage design. (simple right now. we can add to it to cover features for included later
 *
 * Items: {adaPT_users}
 *
 * adaPT_users -- map. K=username, V=temporary value
 */

/**
 *
 * @param {*} username
 * @returns true if account with username exists
 */
async function loginRequest(username) {
  const data = localStorage.getItem("adaPT_users");
  const parsedJSON = data === null ? {} : JSON.parse(data);
  if (parsedJSON[username] !== undefined) {
    return { success: true };
  }
  return { success: false, error: "user not found" };
}

/**
 *
 * @param {*} username
 * @returns true if account with username does not exist
 */
async function signupRequest(username) {
  const data = localStorage.getItem("adaPT_users");
  const parsedJSON = data === null ? {} : JSON.parse(data);
  if (parsedJSON[username] !== undefined) {
    return { success: false, error: "user already exists" };
  }
  if (parsedJSON[username] === undefined) {
    parsedJSON[username] = "temp data";
  }
  localStorage.setItem("adaPT_users", JSON.stringify(parsedJSON));
  return { success: true };
}

export { loginRequest, signupRequest };
