const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const { addDeployment, getDeployment } = require('./logic');

program
  .version('0.0.1')
  .description('Deployment management system');
program
  .command('addDeployment <environment> <serviceName> <branch> <commit> <image> <serviceJson file>')
  //.alias('d')
  .description('Add a deployment')
  .action((environment, serviceName, branch, commit, image, serviceJson) => {
    let o = {
      environment: environment,
      serviceName: serviceName,
      branch: branch, 
      commit: commit,
      image: image,
      serviceJson: serviceJson || null
    }
    addDeployment(o);
  });
program
  .command('getDeployment <environment> <key> <value>')
  //.alias('g')
  .description("Get Deployment(s)")
  .action((environment, key, value) => getDeployment(environment, key, value));

program.parse(process.argv);
