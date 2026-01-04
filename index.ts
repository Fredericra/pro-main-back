import express,{ type Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './src/route/index';



const App:Express = express();
config();


App.use(cors());
App.use(express.json());
App.use('/api', router);


const PORT = process.env.PORT || 3000;

App.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})