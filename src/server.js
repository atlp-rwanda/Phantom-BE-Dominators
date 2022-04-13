import app from './app';
import prop from './config/config';

const currentConfig = prop[process.env.NODE_ENV];
const { port } = currentConfig;
const server = app.listen(port, () =>
  console.log(`App listening on ${port}!....`)
);

export default server;
