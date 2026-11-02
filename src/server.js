import app from './app.js';
import { sequelize } from './models/index.js';

const port = process.env.PORT || 3000;

await sequelize.authenticate();
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
