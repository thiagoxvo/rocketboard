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
 define(
  [ 'flight/lib/component',
    'component/templates/issue_template',
    'component/ui/copyable'],
  function (defineComponent, withIssueTemplate, copyable) {
    return defineComponent(track, withIssueTemplate, copyable);

    function track() {
      this.defaultAttrs({
        issueItemSelector: '.issue',
        issuesCount: 0
      });

      this.isIssueOnThisTrack = function (issue) {

        return issue.labels[0] != undefined && issue.labels[0].name === this.attr.trackType;
      };

      this.filterAndReorderIssues = function (issues) {
        var filteredIssues;
        filteredIssues = _.filter(issues, this.isIssueOnThisTrack, this);
        this.attr.issues = filteredIssues;

        return filteredIssues;
      };


      this.sortIssues = function(){
        var divList = $(".issue", this.node);
        divList.sort(function(a, b){ return $(a).attr('data-priority') -  $(b).attr('data-priority') });

        //$(".issue-track", this.node).html(divList);
        divList.appendTo(this.node);

      };

      this.displayIssues = function (ev, data) {
        var issues = this.filterAndReorderIssues(data.issues);
        this.attr.issuesCount += issues.length;

        issues.forEach(function (issue) {
          if(issue.labels[0].name != "4 - Done") {
            this.$node.prepend(this.renderIssue(issue));
          }
        }.bind(this));

        $('.panel-heading.backlog-header .issues-count').text(' (' + $('.issue-track.backlog .issue').length + ')');
        $('.panel-heading.ready-header .issues-count').text(' (' + $('.issue-track.ready .issue').length + ')');
        $('.panel-heading.development-header .issues-count').text(' (' + $('.issue-track.development .issue').length + ')');
        $('.panel-heading.quality-assurance-header .issues-count').text(' (' + $('.issue-track.quality-assurance .issue').length + ')');

        if(this.attr.trackType === "4 - Done") {
          $('.panel-heading.done .issues-count').text(' (' + this.attr.issuesCount + ')');
        }

        this.trigger('ui:issues:displayed');
      };

      this.cleanCount = function() {
        this.attr.issuesCount = 0;
      };

      this.moveIssue = function(movedToTrackName , params) {
        var labelDone = "4 - Done";
        if(this.attr.trackType === labelDone && params.label === labelDone) {
          this.attr.issuesCount++;
          $('.panel-heading.done .issues-count').text(' (' + this.attr.issuesCount + ')');
        }
      };

      this.priorityChanged = function(event, elementChanged){
        $("#"+elementChanged.id).attr('data-priority',elementChanged.priority);
      };

      this.renderIssue = function (issue) {
        var renderedIssue = $(this.render(issue));
        if (renderedIssue.find('.assignee-avatar').attr('src') != "" ) {
          renderedIssue.find('.assigns-myself').addClass('assigned');
          renderedIssue.find('.empty-avatar').hide();
          renderedIssue.find('.empty-avatar-label').hide();
        }
        renderedIssue.find('a.assigns-myself').click(function () {
          this.trigger('ui:assigns:user', {issue: issue});
        }.bind(this));
        return renderedIssue;
      };

      this.getIssues = function(event,eventCallback){
        var issues = $(".issue", this.$node);

        var map = {
          track : this.attr.trackType,
          issues :  _.map(issues, function(val) {
            return {id: val.id, priority: val.dataset.priority };
          })};


          this.trigger(eventCallback.eventCallback, map);
      };

      this.fillPriority = function(event, issues){
          var UIissues = $('.issue', this.$node);

          _.each(UIissues, function(val) {

             var objIssue = _.findWhere(issues.issues , { id : val.id});
             if(objIssue)
                val.dataset.priority = objIssue.priority;
             else if(!val.dataset.priority)
                val.dataset.priority = val.id;

          });

          this.trigger(document, 'ui:issues:ended');
      };

      this.after('initialize', function () {
        this.on(document, 'data:issues:refreshed', this.displayIssues);
        this.on(document, 'data:issues:cleanCount', this.cleanCount);
        this.on(document, 'data:issues:issueMoved', this.moveIssue);
        this.on(document, 'data:issue:priorityChanged', this.priorityChanged);
        this.on(document, 'ui:issues:ended', this.sortIssues);
        this.on(document, 'data:needs:issues', this.getIssues);
        this.on(document, 'data:got:priority', this.fillPriority);
        this.on(this.$node, 'ui:issues:displayed', this.makeCopyable);
      });
    }
  });
