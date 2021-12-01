let Express = require("express");
let router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
// Import the Log Model
const { LogModel } = require('../models');

//Create Workout Log

router.post('/create', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body;
    const {id} = req.user;
    console.log("Id returned ---->", id);
    const workoutEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(workoutEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

    // Get all Workout Logs for all users

router.get("/", async (req, res) => {
    try {
        const workouts = await LogModel.findAll();
        res.status(200).json(workouts);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get an individual log from a user ID

router.get("/:id", validateJWT, async (req, res) => {
    let {id} = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

 //Update a Journal

router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.log;
    const userId = req.user.id;

    const query = {
        where: {
            owner_id: userId
        }
    };
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
117 =======================
118 Delete a Journal
119 =======================
120 */
router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;

    try {
        const query = {
            where: {
                owner_id: ownerId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: "Workout Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;