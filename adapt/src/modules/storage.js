/**
 *
 * localStorage design. (simple right now. we can add to it to cover features for included later
 *
 * Items: {adaPT_users}
 *
 * adaPT_users -- map. K=username, V=temporary value
 */
const loggedInStorage = "adaPT_loggedIn";
const userStorage = "adaPT_users";
const postStorage = "adaPT_posts";
const friendsList = "adaPT_friends";

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
  const data = localStorage.getItem(userStorage);
  const parsedJSON = data === null ? {} : JSON.parse(data);
  if (parsedJSON[username] === undefined) {
    return { success: false, error: "User not found" };
  }

  const hashed = await getHash(password);
  if (
    parsedJSON[username] !== undefined &&
    hashed === parsedJSON[username].password
  ) {
    localStorage.setItem(loggedInStorage, JSON.stringify(parsedJSON[username]));
    const copy = { ...parsedJSON[username] };
    delete copy.password;
    return { success: true, data: copy };
  }

  return { success: false, error: "Incorrect password" };
}

/**
 *
 * @param {*} username
 * @returns true if account with username does not exist
 */
async function signupRequest(formData) {
  const data = localStorage.getItem(userStorage);
  const parsedJSON = data === null ? {} : JSON.parse(data);
  const { username } = formData;
  if (parsedJSON[username] !== undefined) {
    return { success: false, error: "User already exists" };
  }
  const hashed = await getHash(formData.password);
  const newFormData = { ...formData };
  newFormData.password = hashed;
  if (parsedJSON[username] === undefined) {
    parsedJSON[username] = newFormData;
  }
  localStorage.setItem(userStorage, JSON.stringify(parsedJSON));
  localStorage.setItem(loggedInStorage, JSON.stringify(parsedJSON[username]));

  const copy = { ...parsedJSON[username] };
  delete copy.password;
  return { success: true, data: parsedJSON[username] };
}

function logout() {
  localStorage.removeItem(loggedInStorage);
}

function checkLoggedIn() {
  //const data = localStorage.getItem(loggedInStorage);
  //const parsedJSON = data === null ? null : JSON.parse(data);
  //return parsedJSON;
  return null;
}

async function getUserData(username) {
  const data = localStorage.getItem(userStorage);
  const parsedJSON = data === null ? {} : JSON.parse(data);
  if (parsedJSON[username] === undefined) {
    return { success: false, error: "User not found" };
  }
  const copy = { ...parsedJSON[username] };
  delete copy.password;
  return { success: true, data: copy };
}

async function getUsernamesList() {
  const data = localStorage.getItem(userStorage);
  const parsedJSON = data === null ? {} : JSON.parse(data);
  const usernames = Object.keys(parsedJSON);
  return usernames;
}

function getPosts(username) {
  const data = localStorage.getItem(postStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter((post) => post.poster === username);
  filtered.sort((a, b) => b.time - a.time);
  return filtered;
}

function postPost(username, postData) {
  const data = localStorage.getItem(postStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const completePostData = { ...postData, poster: username };
  parsedJSON.push(completePostData);
  localStorage.setItem(postStorage, JSON.stringify(parsedJSON));
}

function getPost(postID) {
  // TODO Add retrieving from storage functionality
  return {
    username: "testUser",
    timestamp: new Date(),
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imageURL:
      "https://www.clipartkey.com/mpngs/m/122-1222244_fat-yoshi-transparent-fat-yoshi-transparent-background.png",
  };
}

function addFriend(username1, username2) {
  const data = localStorage.getItem(friendsList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  parsedJSON.push([username1, username2]);
  localStorage.setItem(friendsList, JSON.stringify(parsedJSON));
  return { success: true };
}

function removeFriend(username1, username2) {
  const data = localStorage.getItem(friendsList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  for (var i = 0; i < parsedJSON.length; i++) {
    if (parsedJSON[i][0] === username1 && parsedJSON[i][1] === username2 ||
      parsedJSON[i][0] === username2 && parsedJSON[i][1] === username1) {
      parsedJSON.splice(i, 1);
    }
  }
  localStorage.setItem(friendsList, JSON.stringify(parsedJSON));
  return { success: true };
}

function areFriends(username1, username2) {
  const data = localStorage.getItem(friendsList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  for (const pair of parsedJSON) {
    if (pair[0] === username1 && pair[1] === username2 ||
        pair[0] === username2 && pair[1] === username1) {
      return true;
    }
  }
  return false;
}

function getProfilePicURL(username) {
  // TODO Add retrieving from storage functionality
  return "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
}

export {
  loginRequest,
  signupRequest,
  checkLoggedIn,
  getUserData,
  getUsernamesList,
  logout,
  getPosts,
  postPost,
  getPost,
  addFriend,
  removeFriend,
  areFriends,
  getProfilePicURL,
};
