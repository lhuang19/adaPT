/**
 *
 * localStorage design. (simple right now. we can add to it to cover features for included later
 *
 * Items: {adaPT_users}
 *
 * adaPT_users -- map. K=username, V=temporary value
 */

async function getHash(input) {
  const encoded = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  let result = "";
  const view = new DataView(hash);
  for (let i = 0; i < hash.byteLength; i += 4) {
    result += `00000000${view.getUint32(i).toString(16).slice(-8)}`;
  }
  return result;
}

/**
 *
 * @param {*} username
 * @returns true if account with username exists
 */
async function loginRequest(username, password) {
  const data = localStorage.getItem("adaPT_users");
  const parsedJSON = data === null ? {} : JSON.parse(data);
  if (parsedJSON[username] === undefined) {
    return { success: false, error: "User not found" };
  }

  const hashed = await getHash(password);
  if (
    parsedJSON[username] !== undefined &&
    hashed === parsedJSON[username].password
  ) {
    const { password, ...withoutPassword } = parsedJSON[username];
    return { success: true, data: withoutPassword };
  }

  return { success: false, error: "Incorrect password" };
}

/**
 *
 * @param {*} username
 * @returns true if account with username does not exist
 */
async function signupRequest(formData) {
  const data = localStorage.getItem("adaPT_users");
  const parsedJSON = data === null ? {} : JSON.parse(data);
  const { username } = formData;
  if (parsedJSON[username] !== undefined) {
    return { success: false, error: "User already exists" };
  }
  const hashed = await getHash(formData.password);
  formData.password = hashed;
  if (parsedJSON[username] === undefined) {
    parsedJSON[username] = formData;
  }
  localStorage.setItem("adaPT_users", JSON.stringify(parsedJSON));
  const { password, ...withoutPassword } = parsedJSON[username];
  return { success: true, data: withoutPassword };
}

export { loginRequest, signupRequest };
