describeComponent('component/data/github_issues', function () {
  beforeEach(function () {
    this.setupComponent();
  });


  describe("fetch issues", function(){
    it('triggers data:repositories when user is not set', function () {
      var eventSpy = spyOnEvent(document, "ui:needs:githubUser")
      this.component.trigger("ui:needs:issues", {'repoName': 'repo'});

      expect(eventSpy).toHaveBeenTriggeredOn(document)
    });

    it('triggers data:repositories when repositories is not set', function () {
      var eventSpy = spyOnEvent(document, "data:repositories")
      this.component.trigger("ui:needs:issues", {'repoName': 'repo', 'user': 'user'});

      expect(eventSpy).toHaveBeenTriggeredOn(document)
    });
  });

  describe("create a issue", function(){
    it('trigger event data:issues:refreshed', function () {
      var eventSpy = spyOnEvent(document, "data:issues:refreshed")

      this.component.trigger("ui:add:issue", {'issue': 'data'});

      expect(eventSpy).toHaveBeenTriggeredOn(document)
      expect(eventSpy.mostRecentCall.data).toEqual({
          'issues': {'issue': 'data'}
      });
    });
  });
});
