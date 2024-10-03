import axios from "axios";
import dayjs from "dayjs";

export async function readJsonFile(file:string):Promise<FlightResponse[] | undefined>{
    try {
        const res = await axios.get(file);
        return res.data;
      } catch (error) {
        // handle error
      }
}

interface FlightResponse {
    departureTime: string,
    arrivalTime: string,
    carrier: string,
    origin: string,
    destination: string
}

interface IFlightList extends FlightResponse {
    score: number,
}

interface ICalculdateScore {
    departureTime?: string,
    arrivalTime?: string,
    flightDuration?: string,
    carrier?: string,
}

function getDistanceBetweenAirports(code1: string, code2: string): number {
    return 1;
}

function calculateScoreForFlight(params:ICalculdateScore, flight: FlightResponse) {
    const date1 = dayjs(params.departureTime)
    const flightDuration = date1.diff(params.arrivalTime, 'hour');
    const carrierScore = flight.carrier === params.carrier ? 1 : 0.9;
    const distance = getDistanceBetweenAirports(flight.origin, flight.destination);
    return flightDuration * carrierScore + distance;
}

export async function calculateScore( params: ICalculdateScore ): Promise<IFlightList[]> {
    const data = await readJsonFile("https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt");
    const res:IFlightList[] = [];
    if (data) {
        data.filter(flight=>{ 
            return flight.departureTime === params.departureTime || flight.departureTime > params.departureTime! }
        ).map( flight =>{
            const score = calculateScoreForFlight(params, flight);
            res.push({
                ...flight,
                score 
            });
        });
    }

    res.sort((a, b) => {
        if (a.score < b.score) {
            return -1;
        }
        if (a.score > b.score) {
            return 1;
        }
        return 0;
    });
    return res;
}