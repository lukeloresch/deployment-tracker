const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const { addDeployment, getDeployment } = require('./logic');

program
  .version('0.0.1')
  .description('Deployment management system');

program
  .command('addDeployment <environment> <serviceName> <branch> <commit> <image>')
  //.alias('d')
  .description('Add a deployment')
  .action((environment, serviceName, branch, commit, image) => {
    addContact({});
  });

program
  .command('getDeployment <environment> <key> <value>')
  //.alias('g')
  .description("Get Deployment(s)")
  .action((environment, key, value) => getDeployment(environment, key, value));

program.parse(process.argv);
