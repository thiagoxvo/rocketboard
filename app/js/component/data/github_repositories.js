/*
 * Copyright 2014 Thoughtworks Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(['flight/lib/component', 'component/mixins/with_auth_token_from_hash', 'component/mixins/repositories_urls'],
  function (defineComponent, withAuthTokeFromHash, repositoriesURLs) {
    return defineComponent(githubRepositories, withAuthTokeFromHash, repositoriesURLs);

    function githubRepositories() {
      this.getRepositoryByName = function(ev, data){
        var repositories = {};
        var newData = _.clone(data);

        var filterRepositoriesByName = function (name) {
          var nilRepository = {'url': "", 'request': ""};

          switch (name) {
          case 'all':
            newData.repositories = JSON.stringify(_.values(repositories));
            break;
          default:
            newData.repositories = JSON.stringify(_.has(repositories, name) ? [repositories[name]] : [nilRepository])
          }
        };

        $.getJSON(newData.user.repos_url, {access_token: this.getCurrentAuthToken()}, function (reposData) {
          _.each(reposData, function(repo){
            repositories[repo.name] = {
              'url': repo.url,
              'name': repo.name
            }
          }.bind(this));

          filterRepositoriesByName(newData.repoName)
          this.trigger(newData.eventToReturn, newData);
        }.bind(this));
      }

      this.after('initialize', function () {
        this.on('data:repositories', this.getRepositoryByName);
      });
    }
  }
);
