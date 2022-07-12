import { app } from "@shared/infra/http/app";

import { AppDataSource } from "@shared/infra/typeorm";

const PORT = process.env.PORT || 3333;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
  })
  .catch((err) => {
    console.error("Error during data source initialization.", err);
  });
