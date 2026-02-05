import type { Core } from '@strapi/strapi';

interface Config {
  contentType: string;
  attribute?: string;
}

/**
 * Policy to check if a user has access to a specific resource.
 * 
 * Usage in route config:
 * config: {
 *   policies: [
 *     {
 *       name: 'plugin::multi-tenant.is-same-user-group',
 *       config: {
 *         contentType: 'api::workspace.workspace',
 *         attribute: 'workspace' // optional - nested relation
 *       }
 *     }
 *   ]
 * }
 */
export default async (
  policyContext: any,
  config: Config,
  { strapi }: { strapi: Core.Strapi }
): Promise<boolean> => {
  // Must have an ID parameter and authenticated user
  if (!policyContext.params.id || !policyContext.state.user) {
    return false;
  }

  // Fetch the resource with userGroup populated
  const resource = await strapi.db.query(config.contentType).findOne({
    where: { id: policyContext.params.id },
    populate: config.attribute
      ? [`${config.attribute}.userGroup`]
      : ['userGroup'],
  });

  if (!resource) {
    return false;
  }

  // Get all allowed user group IDs for this user
  const allowedUserGroupIds = await strapi
    .plugin('multi-tenant')
    .service('user-group')
    .findAllowed(policyContext.state.user.id);

  if (allowedUserGroupIds.length === 0) {
    return false;
  }

  // If updating, check that the new userGroup (if changed) is also allowed
  if (policyContext.request.body?.data) {
    const requestData = policyContext.request.body.data;
    const requestDataUserGroup = config.attribute
      ? requestData[config.attribute]?.userGroup
      : requestData.userGroup;

    if (requestDataUserGroup) {
      const requestDataUserGroupId = Number.isInteger(requestDataUserGroup)
        ? requestDataUserGroup
        : requestDataUserGroup?.id;

      if (requestDataUserGroupId && !allowedUserGroupIds.includes(requestDataUserGroupId)) {
        return false;
      }
    }
  }

  // Check if the resource's userGroup is in the allowed list
  const resourceUserGroup = config.attribute
    ? resource[config.attribute]?.userGroup
    : resource.userGroup;

  return resourceUserGroup && allowedUserGroupIds.includes(resourceUserGroup?.id);
};
