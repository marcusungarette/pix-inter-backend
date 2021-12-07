import express from 'express';

const app = express();
const PORT = 3333;

app.get('/', (request, response) =>
  response.json({
    message: 'Meu server Express, Typescript e ESLint!',
  }),
);

app.listen(PORT, () => {
  console.log(`Back-end started in ${PORT} port!`);
});
