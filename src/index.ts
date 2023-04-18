import express from "express";
import { z } from "zod";

const port = 8080; // default port to listen
const app = express();
app.use(express.json());

const Bug = z.object({
    createdAt: z.string(),
    status: z.union([z.literal("open"), z.literal("closed")]),
    severity: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), z.literal("critical")]),
    description: z.string(),
    reportedBy: z.string()
});

type Bug = z.infer<typeof Bug>;

const bugs: Bug[] = [
    {
        createdAt: "2023-04-17",
        status: "open",
        severity: "low",
        description: "the first bug I made",
        reportedBy: "jmoorhead"
    }
];

// define a route handler for the default home page
app.get( "/", (req, res) => {
    res.json( bugs );
} );

app.post("/", (req, res) => {
    let newBug: Bug;
    try {
        newBug = Bug.parse(req.body);
    } catch (e) {
        console.log(e);
        res.json({status: 400, error: "invalid request body"});
        return;
    }

    console.log("new bug: ", newBug);
    bugs.push(newBug);

    res.json({reportedBy: req.body?.reportedBy});
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );