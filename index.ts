import express, { Express, Request, Response } from "express";
import {calculateScore} from "./utils/utils";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  
  if(!req.query.departureTime && !req.query.arrivalTime && !req.query.flightDuration && !req.query.airlineCarrier){
    res.status(400).send("Missed parameters")
  }

  // ts-node --logError
  const result = await calculateScore({
    departureTime: req.query.departureTime?.toString(),
    arrivalTime: req.query.arrivalTime?.toString(),
    carrier: req.query.carrier?.toString(),
    flightDuration: req.query.flightDuration?.toString()
  })
  
  res.send(result);
  
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});