# interview-comity

M. Paul Weeks / February 18 2022

## how to run

- Have node version 14+ installed
  - If you have nvm installed, you can run `nvm use` to load the version specified in `.nvmrc`
- Run `npm install` to install all necessary dependencies
- Run the command `npm run start [directory]`, where `directory` is the relative path to the CSV files
  - e.g. `npm run start data/large`
  - If no path is provided, it will default to `data/small`
- The result will be located in `out/`
