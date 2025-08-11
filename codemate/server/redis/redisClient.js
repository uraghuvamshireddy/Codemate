import dotenv from 'dotenv';
import {createClient} from 'redis'

dotenv.config();

const redisClient = createClient({
    username: process.env.redisUsername,
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: Number(process.env.redisPort)
 
    }
});

redisClient.on('error',(err)=>console.error('Redis Client Error',err));

await redisClient.connect();
export default redisClient;