define([],
  function () {
    return function () {
      this.defaultOptions = function () {
        return "per_page=100&state=all&"
      };

      this.getPageParam = function(page){
        return (isFinite(page)) ? "page=" + (page <= 0 ? 1 : page) + "&" : '';
      };

      this.authRequest = function (url) {
        return url + this.accessToken();
      }

      this.repoIssuesURL = function (repo, page) {
        return this.authRequest(repo + '/issues?' + this.defaultOptions() + this.getPageParam(page));
      };

      this.accessToken = function () {
        return "access_token=" + this.getCurrentAuthToken();
      };

      this.newIssueURL = function(repoUrl){
        return repoUrl.replace("api.github.com/repos", "github.com") + "/issues/new";
      };
    }
  }
);
