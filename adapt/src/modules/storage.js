const MOCK_LOGIN_TOKEN = false; // change to false if you need multiple ppl logged in at same time.

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
const reactionStorage = "adaPT_reactions";
const friendsList = "adaPT_friends";
const friendRequestList = "adaPT_friendRequests";

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
  const data = localStorage.getItem(loggedInStorage);
  const parsedJSON = data === null ? null : JSON.parse(data);
  return MOCK_LOGIN_TOKEN ? parsedJSON : null;
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

async function getReactions(poster, time, username) {
  const data = localStorage.getItem(reactionStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (reaction) => reaction.poster === poster && reaction.time === time
  );
  const smiles = filtered.filter((reaction) => reaction.type === "smile");
  const likes = filtered.filter((reaction) => reaction.type === "like");
  const checks = filtered.filter((reaction) => reaction.type === "check");

  return {
    smileCount: smiles.length,
    likeCount: likes.length,
    checkCount: checks.length,
    smiled:
      smiles.filter((reaction) => reaction.username === username).length > 0,
    liked:
      likes.filter((reaction) => reaction.username === username).length > 0,
    checked:
      checks.filter((reaction) => reaction.username === username).length > 0,
  };
}

async function postReaction(poster, time, username, type) {
  const data = localStorage.getItem(reactionStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  parsedJSON.push({ poster, time, username, type });
  localStorage.setItem(reactionStorage, JSON.stringify(parsedJSON));
}

async function deleteReaction(poster, time, username, type) {
  const data = localStorage.getItem(reactionStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (reaction) =>
      reaction.poster !== poster ||
      reaction.time !== time ||
      reaction.username !== username ||
      reaction.type !== type
  );
  localStorage.setItem(reactionStorage, JSON.stringify(filtered));
}

function getPosts(usernamesToFetch) {
  const data = localStorage.getItem(postStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter((post) =>
    usernamesToFetch.includes(post.poster)
  );
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

function deletePost(poster, time) {
  const data = localStorage.getItem(postStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (post) => post.poster !== poster || post.time !== time
  );
  localStorage.setItem(postStorage, JSON.stringify(filtered));

  const rData = localStorage.getItem(reactionStorage);
  const rParsedJSON = rData === null ? [] : JSON.parse(rData);
  const rFiltered = rParsedJSON.filter(
    (reaction) => reaction.poster !== poster || reaction.time !== time
  );
  localStorage.setItem(reactionStorage, JSON.stringify(rFiltered));
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

function sendFriendRequest(username1, username2) {
  if (requestedFriend(username1, username2) !== 0) {
    return { success: false };
  }
  const data = localStorage.getItem(friendRequestList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  parsedJSON.push([username1, username2]);
  localStorage.setItem(friendRequestList, JSON.stringify(parsedJSON));
  return { success: true };
}

function deleteFriendRequest(username1, username2) {
  const data = localStorage.getItem(friendRequestList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (pair) => pair[0] !== username1 || pair[1] !== username2
  );
  localStorage.setItem(friendRequestList, JSON.stringify(filtered));
  return { success: true };
}

function requestedFriend(username1, username2) {
  const data = localStorage.getItem(friendRequestList);
  const parsedJSON = data === null ? [] : JSON.parse(data);

  const filtered = parsedJSON.filter(
    (pair) => pair[0] === username1 && pair[1] === username2
  );
  if (filtered.length !== 0) {
    return 1;
  }

  const filtered2 = parsedJSON.filter(
    (pair) => pair[0] === username2 && pair[1] === username1
  );
  if (filtered2.length !== 0) {
    return 2;
  }

  return 0;
}

function getFriends(username) {
  const data = localStorage.getItem(friendsList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (pair) => pair[0] === username || pair[1] === username
  );
  const onlyFriends = filtered.map(([a, b]) => (a !== username ? a : b));

  return onlyFriends;
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
  const filtered = parsedJSON.filter(
    (pair) =>
      (pair[0] !== username1 || pair[1] !== username2) &&
      (pair[0] !== username2 || pair[1] !== username1)
  );
  localStorage.setItem(friendsList, JSON.stringify(filtered));
  return { success: true };
}

function areFriends(username1, username2) {
  const data = localStorage.getItem(friendsList);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (pair) =>
      (pair[0] === username1 && pair[1] === username2) ||
      (pair[0] === username2 && pair[1] === username1)
  );
  if (filtered.length !== 0) {
    return true;
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
  deletePost,
  getReactions,
  postReaction,
  deleteReaction,
  logout,
  getPosts,
  postPost,
  getPost,
  sendFriendRequest,
  deleteFriendRequest,
  requestedFriend,
  getFriends,
  addFriend,
  removeFriend,
  areFriends,
  getProfilePicURL,
};
