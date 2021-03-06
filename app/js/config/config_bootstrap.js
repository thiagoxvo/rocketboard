define([],
  function () {
    var config;

    $.getJSON('/config', function (data) {
      config = data;
    });

    return {
      getConfig: function () {
        return config;
      },
      getRepos: function() {
        return config.repos
      },
      getReposNames: function() {
        return Object.keys(config.repos);
      },
      getLabels: function() {
        return config.labels;
      }
    }

  }
);
