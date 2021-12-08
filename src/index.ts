import express from 'express';

import { globalErrors } from './middlewares/globalErrors';
import routes from './routes';

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(routes);

app.use(globalErrors);

app.listen(PORT, () => {
  console.log(`Back-end started in ${PORT} port!`);
});
