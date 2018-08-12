const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const { addDeployment, getDeployment, replay } = require('./logic');

program
  .version('0.0.1')
  .description('Deployment management system');
program
  .command('addDeployment <environment> <serviceName> <branch> <commit> <image> <serviceJson file>')
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
  .description("Get Deployment(s)")
  .action((environment, key, value) => getDeployment(environment, key, value));
program
  .command('replay <environment>')
  .description("will output all servicejson files in a directory in the same location this is run from, will also output a file with a script to run in swarm builder")
  .action((environment) => replay(environment));



program.parse(process.argv);
