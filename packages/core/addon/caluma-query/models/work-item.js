import { inject as service } from "@ember/service";

import CalumaQueryModel, {
  momentAttr,
} from "@projectcaluma/ember-core/caluma-query/models/index";

export default class WorkItemModel extends CalumaQueryModel {
  @service intl;

  @momentAttr createdAt;
  @momentAttr modifiedAt;
  @momentAttr closedAt;
  @momentAttr deadline;

  get status() {
    return this.intl.t(
      `caluma.caluma-query.work-item.status.${this.raw.status}`
    );
  }

  static fragment = `{
    createdAt
    createdByUser
    createdByGroup
    closedAt
    closedByUser
    closedByGroup
    status
    meta
    addressedGroups
    controllingGroups
    assignedUsers
    name
    deadline
  }`;
}
