var repos = {};
var labels = {};
var env = process.env;

function addRepo(name, key, label) {
  env[key] && (repos[name] = env[key]);
  env[key] && (labels[name] = (label || repos[name]));
}

addRepo('rb-issues', 'RB_ISSUES', 'Issues');

module.exports = {
  repos: repos,
  labels: labels
};
