const MOCK_LOGIN_TOKEN = true; // change to false if you need multiple ppl logged in at same time.

/**
 *
 * localStorage design. (simple right now. we can add to it to cover features for included later
 *
 * Items: {adaPT_users}
 *
 * adaPT_users -- map. K=username, V=temporary value
 */
const loggedInStorage = "supervulnerabletoken";
const exerciseStorage = "adaPT_exercises";
const friendsList = "adaPT_friends";
const friendRequestList = "adaPT_friendRequests";
const messageStorage = "adaPT_messages";

// ignore for now?
function logout() {
  localStorage.removeItem(loggedInStorage);
}
// ignore for now?
function checkLoggedIn() {
  const data = localStorage.getItem(loggedInStorage);
  return MOCK_LOGIN_TOKEN ? data : null;
}

function addLoginToken(token) {
  localStorage.setItem(loggedInStorage, token);
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

function getMessages(username) {
  const data = localStorage.getItem(messageStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const filtered = parsedJSON.filter(
    (message) => message.recipient === username
  );
  filtered.sort((a, b) => b.time - a.time);
  return filtered;
}

function postMessage(username, messageData) {
  const data = localStorage.getItem(messageStorage);
  const parsedJSON = data === null ? [] : JSON.parse(data);
  const completeMessageData = {
    ...messageData,
    poster: username,
  };
  parsedJSON.push(completeMessageData);
  localStorage.setItem(messageStorage, JSON.stringify(parsedJSON));
}

export {
  addLoginToken,
  checkLoggedIn,
  logout,
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
  getMessages,
  postMessage,
};
