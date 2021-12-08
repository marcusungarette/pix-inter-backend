import cors from 'cors';
import express from 'express';
import { createConnection } from 'typeorm';
import 'express-async-errors';

import { globalErrors } from './middlewares/globalErrors';
import routes from './routes';

createConnection()
  .then(connection => {
    connection.synchronize(true);
    const app = express();
    const PORT = 3333;

    app.use(cors());

    app.use(express.json());
    app.use(routes);

    app.use(globalErrors);

    app.listen(PORT, () => {
      console.log(`Back-end started in ${PORT} port!`);
    });
  })
  .catch(error => {
    console.log('Unable to connect to the database', error);
  });
