const Users = require("../models/user");
const Exercises = require("../models/exercises");

const assignExercise = async (exerciseData) => {
  if (!exerciseData) throw new Error("params not filled");

  try {
    const pt = await Users.findOne({
      username: exerciseData.pt,
    }).exec();
    const patient = await Users.findOne({
      username: exerciseData.patient,
    }).exec();
    const result = await Exercises.create({
      ...exerciseData,
      pt: pt._id,
      patient: patient._id,
    });
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    throw new Error("could not assign exercise");
  }
};

const getExercises = async (usernameData) => {
  const { username } = usernameData;
  if (!username) throw new Error("params not filled");
  try {
    const user = await Users.findOne({
      username,
    }).exec();
    let result;
    if (user.role === "PT") {
      result = await Exercises.find({
        pt: user,
      })
        .populate("patient")
        .populate("pt")
        .exec();
    } else {
      result = await Exercises.find({
        patient: user,
      })
        .populate("patient")
        .populate("pt")
        .exec();
    }
    return result;
  } catch (err) {
    throw new Error("could not get exercises");
  }
};

const deleteExercise = async (exerciseData) => {
  if (!exerciseData || !exerciseData.pt || !exerciseData.creationTime)
    throw new Error("params not filled");

  return Exercises.deleteOne({
    pt: exerciseData.pt,
    creationTime: exerciseData.creationTime,
  }).exec();
};

const setSetsCompleted = async (exerciseData) => {
  if (
    !exerciseData ||
    !exerciseData.patient ||
    !exerciseData.creationTime ||
    !exerciseData.setsCompleted
  )
    throw new Error("params not filled");

  try {
    const exercise = await Exercises.findOne({
      patient: exerciseData.patient,
      creationTime: exerciseData.creationTime,
    });
    exercise.setsCompleted = exerciseData.setsCompleted;
    return await exercise.save();
  } catch (err) {
    throw new Error("could not set completed sets");
  }
};

module.exports = {
  assignExercise,
  getExercises,
  deleteExercise,
  setSetsCompleted,
};
