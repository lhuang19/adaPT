const Users = require("../models/user");
const Exercises = require("../models/exercises");
const { getUserData } = require("./user.controllers");

const assignExercise = async (exerciseData) => {
  if (!exerciseData) throw new Error("params not filled");

  try {
    const pt = await Users.findOne({
      username: exerciseData.ptUsername,
    }).exec();
    const patient = await Users.findOne({
      username: exerciseData.patientUsername,
    }).exec();
    const result = await Exercises.create({
      ...exerciseData,
      pt: pt._id,
      patient: patient._id,
    });
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not assign exercise");
  }
};

const getExercises = async (username) => {
  if (!username) throw new Error("params not filled");

  try {
    let result;
    if (getUserData(username).role === "PT") {
      result = await Exercises.find({
        pt: { $in: username },
      })
        .populate("users")
        .exec();
    } else {
      result = await Exercises.find({
        patient: { $in: username },
      })
        .populate("users")
        .exec();
    }
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get exercises");
  }
};

const deleteExercise = async (exerciseData) => {
  if (!exerciseData || !exerciseData.pt || !exerciseData.creationTime)
    throw new Error("params not filled");

  try {
    return await Exercises.deleteOne({
      pt: exerciseData.pt,
      creationTime: exerciseData.creationTime,
    }).exec();
  } catch (err) {
    console.error(err);
    throw new Error("could not delete exercise");
  }
};

// TODO Add function to modify completed sets counter

module.exports = {
  assignExercise,
  getExercises,
  deleteExercise,
};
