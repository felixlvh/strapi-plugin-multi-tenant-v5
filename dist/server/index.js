"use strict";
const bootstrap = async ({ strapi }) => {
  const actions = [
    {
      section: "plugins",
      displayName: "Read",
      uid: "read",
      pluginName: "multi-tenant"
    },
    {
      section: "plugins",
      displayName: "Create",
      uid: "create",
      pluginName: "multi-tenant"
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "update",
      pluginName: "multi-tenant"
    },
    {
      section: "plugins",
      displayName: "Delete",
      uid: "delete",
      pluginName: "multi-tenant"
    }
  ];
  await strapi.admin?.services.permission.actionProvider.registerMany(actions);
};
const kind$1 = "collectionType";
const collectionName$1 = "organizations";
const info$1 = {
  singularName: "organization",
  pluralName: "organizations",
  displayName: "Organization",
  description: "A tenant organization in the multi-tenant system"
};
const options$1 = {
  draftAndPublish: false
};
const pluginOptions$1 = {
  "content-manager": {
    visible: true
  },
  "content-type-builder": {
    visible: true
  }
};
const attributes$1 = {
  name: {
    type: "string",
    required: true
  },
  slug: {
    type: "uid",
    targetField: "name",
    required: true
  },
  description: {
    type: "text"
  },
  plan: {
    type: "enumeration",
    "enum": [
      "free",
      "starter",
      "pro",
      "enterprise"
    ],
    "default": "free"
  },
  userGroups: {
    type: "relation",
    relation: "oneToMany",
    target: "plugin::multi-tenant.user-group",
    mappedBy: "organization"
  },
  isActive: {
    type: "boolean",
    "default": true
  }
};
const schema$1 = {
  kind: kind$1,
  collectionName: collectionName$1,
  info: info$1,
  options: options$1,
  pluginOptions: pluginOptions$1,
  attributes: attributes$1
};
const organization$2 = {
  schema: schema$1
};
const kind = "collectionType";
const collectionName = "user_groups";
const info = {
  singularName: "user-group",
  pluralName: "user-groups",
  displayName: "User Group",
  description: "A group of users within an organization"
};
const options = {
  draftAndPublish: false
};
const pluginOptions = {
  "content-manager": {
    visible: true
  },
  "content-type-builder": {
    visible: true
  }
};
const attributes = {
  name: {
    type: "string",
    required: true
  },
  description: {
    type: "text"
  },
  users: {
    type: "relation",
    relation: "oneToMany",
    target: "plugin::users-permissions.user"
  },
  organization: {
    type: "relation",
    relation: "manyToOne",
    target: "plugin::multi-tenant.organization",
    inversedBy: "userGroups",
    required: true
  },
  parent: {
    type: "relation",
    relation: "manyToOne",
    target: "plugin::multi-tenant.user-group",
    inversedBy: "children"
  },
  children: {
    type: "relation",
    relation: "oneToMany",
    target: "plugin::multi-tenant.user-group",
    mappedBy: "parent"
  },
  isDefault: {
    type: "boolean",
    "default": false
  }
};
const schema = {
  kind,
  collectionName,
  info,
  options,
  pluginOptions,
  attributes
};
const userGroup$2 = {
  schema
};
const contentTypes = {
  organization: organization$2,
  "user-group": userGroup$2
};
const organization$1 = ({ strapi }) => ({
  async find(ctx) {
    const entities = await strapi.plugin("multi-tenant").service("organization").find(ctx.query);
    return { data: entities };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("organization").findOne(id, ctx.query);
    if (!entity) {
      return ctx.notFound("Organization not found");
    }
    return { data: entity };
  },
  async create(ctx) {
    const entity = await strapi.plugin("multi-tenant").service("organization").create(ctx.request.body.data || ctx.request.body);
    return { data: entity };
  },
  async update(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("organization").update(id, ctx.request.body.data || ctx.request.body);
    return { data: entity };
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("organization").delete(id);
    return { data: entity };
  },
  async findByUser(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized("You must be logged in");
    }
    const entity = await strapi.plugin("multi-tenant").service("organization").findByUser(ctx.state.user.id);
    if (!entity) {
      return ctx.notFound("User does not belong to any organization");
    }
    return { data: entity };
  }
});
const userGroup$1 = ({ strapi }) => ({
  async find(ctx) {
    const entities = await strapi.plugin("multi-tenant").service("user-group").find(ctx.query);
    return { data: entities };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("user-group").findOne(id, ctx.query);
    if (!entity) {
      return ctx.notFound("User group not found");
    }
    return { data: entity };
  },
  async create(ctx) {
    const entity = await strapi.plugin("multi-tenant").service("user-group").create(ctx.request.body.data || ctx.request.body);
    return { data: entity };
  },
  async update(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("user-group").update(id, ctx.request.body.data || ctx.request.body);
    return { data: entity };
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.plugin("multi-tenant").service("user-group").delete(id);
    return { data: entity };
  },
  async me(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized("You must be logged in");
    }
    const entity = await strapi.plugin("multi-tenant").service("user-group").findByUser(ctx.state.user.id);
    if (!entity) {
      return ctx.notFound("User does not belong to any group");
    }
    return { data: entity };
  },
  async addUser(ctx) {
    const { id } = ctx.params;
    const { userId } = ctx.request.body;
    if (!userId) {
      return ctx.badRequest("userId is required");
    }
    const entity = await strapi.plugin("multi-tenant").service("user-group").addUser(id, userId);
    return { data: entity };
  },
  async removeUser(ctx) {
    const { id } = ctx.params;
    const { userId } = ctx.request.body;
    if (!userId) {
      return ctx.badRequest("userId is required");
    }
    const entity = await strapi.plugin("multi-tenant").service("user-group").removeUser(id, userId);
    return { data: entity };
  }
});
const controllers = {
  organization: organization$1,
  "user-group": userGroup$1
};
const findSameUserGroup = (config, { strapi }) => {
  return async (ctx, next) => {
    if (!ctx.state.user) {
      return await next();
    }
    const loggedUserUserGroup = await strapi.db.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: [ctx.state.user.id] }
        }
      }
    });
    if (!loggedUserUserGroup) {
      return await next();
    }
    const allowedUserGroupIds = await strapi.plugin("multi-tenant").service("user-group").findAllowed(ctx.state.user.id);
    ctx.query = {
      ...ctx.query,
      filters: {
        ...ctx.query?.filters,
        ...config.attribute ? {
          [config.attribute]: {
            userGroup: { id: { $in: allowedUserGroupIds } }
          }
        } : { userGroup: { id: { $in: allowedUserGroupIds } } }
      }
    };
    await next();
  };
};
const addSameUserGroup = (config, { strapi }) => {
  return async (ctx, next) => {
    if (!ctx.state.user) {
      return await next();
    }
    const loggedUserUserGroup = await strapi.db.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: [ctx.state.user.id] }
        }
      }
    });
    if (!loggedUserUserGroup) {
      return ctx.badRequest("User does not belong to a user group");
    }
    if (config.attribute) {
      if (!ctx.request.body?.data?.[config.attribute]) {
        return ctx.badRequest(`Request body must include ${config.attribute}`);
      }
      if (!config.contentType) {
        return ctx.badRequest("contentType must be configured when using attribute");
      }
      const contentType = strapi.contentType(config.contentType);
      const relationTarget = contentType?.attributes?.[config.attribute]?.target;
      if (relationTarget) {
        const foreignKey = ctx.request.body?.data?.[config.attribute];
        const attributeId = Number.isInteger(foreignKey) ? foreignKey : foreignKey?.id;
        const resourceToLink = await strapi.db.query(relationTarget).findOne({
          where: { id: attributeId },
          populate: ["userGroup"]
        });
        if (!resourceToLink) {
          return ctx.notFound(
            `Resource "${config.attribute}" with ID ${attributeId} not found`
          );
        }
        const allowedUserGroupIds = await strapi.plugin("multi-tenant").service("user-group").findAllowed(ctx.state.user.id);
        if (!allowedUserGroupIds.includes(resourceToLink.userGroup?.id)) {
          return ctx.forbidden("You do not have access to this resource");
        }
        ctx.request.body = {
          ...ctx.request.body,
          data: {
            ...ctx.request.body.data,
            [config.attribute]: resourceToLink
          }
        };
      }
    } else {
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...ctx.request.body?.data,
          userGroup: loggedUserUserGroup.id
        }
      };
    }
    return await next();
  };
};
const middlewares = {
  "find-same-user-group": findSameUserGroup,
  "add-same-user-group": addSameUserGroup
};
const isSameUserGroup = async (policyContext, config, { strapi }) => {
  if (!policyContext.params.id || !policyContext.state.user) {
    return false;
  }
  const resource = await strapi.db.query(config.contentType).findOne({
    where: { id: policyContext.params.id },
    populate: config.attribute ? [`${config.attribute}.userGroup`] : ["userGroup"]
  });
  if (!resource) {
    return false;
  }
  const allowedUserGroupIds = await strapi.plugin("multi-tenant").service("user-group").findAllowed(policyContext.state.user.id);
  if (allowedUserGroupIds.length === 0) {
    return false;
  }
  if (policyContext.request.body?.data) {
    const requestData = policyContext.request.body.data;
    const requestDataUserGroup = config.attribute ? requestData[config.attribute]?.userGroup : requestData.userGroup;
    if (requestDataUserGroup) {
      const requestDataUserGroupId = Number.isInteger(requestDataUserGroup) ? requestDataUserGroup : requestDataUserGroup?.id;
      if (requestDataUserGroupId && !allowedUserGroupIds.includes(requestDataUserGroupId)) {
        return false;
      }
    }
  }
  const resourceUserGroup = config.attribute ? resource[config.attribute]?.userGroup : resource.userGroup;
  return resourceUserGroup && allowedUserGroupIds.includes(resourceUserGroup?.id);
};
const policies = {
  "is-same-user-group": isSameUserGroup
};
const routes = {
  admin: {
    type: "admin",
    routes: [
      // Organization routes
      {
        method: "GET",
        path: "/organizations",
        handler: "organization.find",
        config: {
          policies: []
        }
      },
      {
        method: "GET",
        path: "/organizations/:id",
        handler: "organization.findOne",
        config: {
          policies: []
        }
      },
      {
        method: "POST",
        path: "/organizations",
        handler: "organization.create",
        config: {
          policies: []
        }
      },
      {
        method: "PUT",
        path: "/organizations/:id",
        handler: "organization.update",
        config: {
          policies: []
        }
      },
      {
        method: "DELETE",
        path: "/organizations/:id",
        handler: "organization.delete",
        config: {
          policies: []
        }
      },
      // User Group routes
      {
        method: "GET",
        path: "/user-groups",
        handler: "user-group.find",
        config: {
          policies: []
        }
      },
      {
        method: "GET",
        path: "/user-groups/:id",
        handler: "user-group.findOne",
        config: {
          policies: []
        }
      },
      {
        method: "POST",
        path: "/user-groups",
        handler: "user-group.create",
        config: {
          policies: []
        }
      },
      {
        method: "PUT",
        path: "/user-groups/:id",
        handler: "user-group.update",
        config: {
          policies: []
        }
      },
      {
        method: "DELETE",
        path: "/user-groups/:id",
        handler: "user-group.delete",
        config: {
          policies: []
        }
      },
      {
        method: "POST",
        path: "/user-groups/:id/add-user",
        handler: "user-group.addUser",
        config: {
          policies: []
        }
      },
      {
        method: "POST",
        path: "/user-groups/:id/remove-user",
        handler: "user-group.removeUser",
        config: {
          policies: []
        }
      }
    ]
  },
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/my-organization",
        handler: "organization.findByUser",
        config: {
          policies: []
        }
      },
      {
        method: "GET",
        path: "/my-user-group",
        handler: "user-group.me",
        config: {
          policies: []
        }
      }
    ]
  }
};
const organization = ({ strapi }) => ({
  /**
   * Find all organizations
   */
  async find(params = {}) {
    return strapi.documents("plugin::multi-tenant.organization").findMany(params);
  },
  /**
   * Find one organization by document ID
   */
  async findOne(documentId, params = {}) {
    return strapi.documents("plugin::multi-tenant.organization").findOne({
      documentId,
      ...params
    });
  },
  /**
   * Find organization by slug
   */
  async findBySlug(slug) {
    const results = await strapi.documents("plugin::multi-tenant.organization").findMany({
      filters: { slug },
      limit: 1
    });
    return results[0] || null;
  },
  /**
   * Create a new organization
   */
  async create(data) {
    return strapi.documents("plugin::multi-tenant.organization").create({
      data
    });
  },
  /**
   * Update an organization
   */
  async update(documentId, data) {
    return strapi.documents("plugin::multi-tenant.organization").update({
      documentId,
      data
    });
  },
  /**
   * Delete an organization
   */
  async delete(documentId) {
    return strapi.documents("plugin::multi-tenant.organization").delete({
      documentId
    });
  },
  /**
   * Get organization for a user
   */
  async findByUser(userId) {
    const userGroup2 = await strapi.db.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: [userId] }
        }
      },
      populate: ["organization"]
    });
    return userGroup2?.organization || null;
  }
});
const userGroup = ({ strapi }) => ({
  /**
   * Find all user groups
   */
  async find(params = {}) {
    return strapi.documents("plugin::multi-tenant.user-group").findMany(params);
  },
  /**
   * Find one user group by document ID
   */
  async findOne(documentId, params = {}) {
    return strapi.documents("plugin::multi-tenant.user-group").findOne({
      documentId,
      ...params
    });
  },
  /**
   * Create a new user group
   */
  async create(data) {
    return strapi.documents("plugin::multi-tenant.user-group").create({
      data
    });
  },
  /**
   * Update a user group
   */
  async update(documentId, data) {
    return strapi.documents("plugin::multi-tenant.user-group").update({
      documentId,
      data
    });
  },
  /**
   * Delete a user group
   */
  async delete(documentId) {
    return strapi.documents("plugin::multi-tenant.user-group").delete({
      documentId
    });
  },
  /**
   * Find the user group for a user
   */
  async findByUser(userId) {
    return strapi.db.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: [userId] }
        }
      },
      populate: ["organization", "parent", "children"]
    });
  },
  /**
   * Find all user groups a user has access to (including children in hierarchy)
   */
  async findAllowed(userId) {
    const loggedUserUserGroup = await strapi.db.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: [userId] }
        }
      },
      populate: ["organization", "organization.userGroups", "organization.userGroups.parent"]
    });
    if (!loggedUserUserGroup) {
      return [];
    }
    const organizationUserGroups = loggedUserUserGroup.organization?.userGroups || [];
    const findPath = (parentId, path = []) => {
      const updatedPath = [...path, parentId];
      const foundGroup = organizationUserGroups.find(
        (group) => group.parent?.id === parentId
      );
      if (foundGroup) {
        return findPath(foundGroup.id, updatedPath);
      }
      return updatedPath;
    };
    return findPath(loggedUserUserGroup.id);
  },
  /**
   * Check if a user belongs to a specific user group or its children
   */
  async userBelongsTo(userId, userGroupId) {
    const allowedGroups = await this.findAllowed(userId);
    return allowedGroups.includes(userGroupId);
  },
  /**
   * Add a user to a user group
   */
  async addUser(userGroupId, userId) {
    const userGroup2 = await strapi.documents("plugin::multi-tenant.user-group").findOne({
      documentId: userGroupId,
      populate: ["users"]
    });
    if (!userGroup2) {
      throw new Error("User group not found");
    }
    const existingUserIds = userGroup2.users?.map((u) => u.id) || [];
    if (existingUserIds.includes(userId)) {
      return userGroup2;
    }
    return strapi.documents("plugin::multi-tenant.user-group").update({
      documentId: userGroupId,
      data: {
        users: [...existingUserIds, userId]
      }
    });
  },
  /**
   * Remove a user from a user group
   */
  async removeUser(userGroupId, userId) {
    const userGroup2 = await strapi.documents("plugin::multi-tenant.user-group").findOne({
      documentId: userGroupId,
      populate: ["users"]
    });
    if (!userGroup2) {
      throw new Error("User group not found");
    }
    const existingUserIds = userGroup2.users?.map((u) => u.id) || [];
    const newUserIds = existingUserIds.filter((id) => id !== userId);
    return strapi.documents("plugin::multi-tenant.user-group").update({
      documentId: userGroupId,
      data: {
        users: newUserIds
      }
    });
  }
});
const services = {
  organization,
  "user-group": userGroup
};
const index = {
  bootstrap,
  contentTypes,
  controllers,
  middlewares,
  policies,
  routes,
  services
};
module.exports = index;
