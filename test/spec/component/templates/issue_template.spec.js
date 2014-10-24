describeMixin('component/templates/issue_template', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  it('returns repository name passing url', function () {
    expect(this.component.getRepoName(
        {
          'url': "https://api.github.com/repos/guipdutra/test_issues_kanboard/issues/1"
        }
    )).toEqual("test_issues_kanboard")
  });
});
