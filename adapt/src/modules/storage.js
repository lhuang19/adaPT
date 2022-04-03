const MOCK_LOGIN_TOKEN = true; // change to false if you need multiple ppl logged in at same time.

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
const commentStorage = "adaPT_comments";
const exerciseStorage = "adaPT_exercises";
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

  const userData = localStorage.getItem(userStorage);
  const userDataParsed = userData === null ? [] : JSON.parse(userData);
  const withUserInformation = filtered.map((postData) => {
    return {
      ...postData,
      firstname: userDataParsed[postData.poster].firstname,
      lastname: userDataParsed[postData.poster].lastname,
    };
  });
  return withUserInformation;
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


function postComment(poster, time, commenter, content, commentTime) {
  const data = localStorage.getItem(commentStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const inputData = { postid: poster + time, commenter, content, commentTime };
  parsedJSON.push(inputData);
  localStorage.setItem(commentStorage, JSON.stringify(parsedJSON));
}

function getComments(poster, time) {
  const data = localStorage.getItem(commentStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (comment) => comment.postid === poster + time
  );
  filtered.sort((a, b) => a.commentTime - b.commentTime);

  const userData = localStorage.getItem(userStorage);
  const userDataParsed = userData === null ? [] : JSON.parse(userData);
  const withUserInformation = filtered.map((commentData) => {
    return {
      ...commentData,
      firstname: userDataParsed[commentData.commenter].firstname,
      lastname: userDataParsed[commentData.commenter].lastname,
    };
  });

  return withUserInformation;

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

function getExercises(username) {
  const data = localStorage.getItem(exerciseStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (exercise) => exercise.patient === username
  );
  return filtered;
}

function addExercise(exerciseData) {
  const data = localStorage.getItem(exerciseStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  parsedJSON.push(exerciseData);
  localStorage.setItem(exerciseStorage, JSON.stringify(parsedJSON));
}

function completeExercise(time) {
  const data = localStorage.getItem(exerciseStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const changedJSON = parsedJSON.map((exercise) =>
    exercise.time === time
      ? { ...exercise, completed: !exercise.completed }
      : exercise
  );
  localStorage.setItem(exerciseStorage, JSON.stringify(changedJSON));
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
  postComment,
  getComments,
  sendFriendRequest,
  deleteFriendRequest,
  requestedFriend,
  getFriends,
  addFriend,
  removeFriend,
  areFriends,
  getExercises,
  addExercise,
  completeExercise,
};
