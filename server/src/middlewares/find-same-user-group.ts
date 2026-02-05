import type { Core } from '@strapi/strapi';

interface Config {
  attribute?: string;
}

/**
 * Middleware to filter queries to only return resources belonging to the user's group.
 * 
 * Usage in route config:
 * middlewares: [
 *   {
 *     name: 'plugin::multi-tenant.find-same-user-group',
 *     config: {
 *       attribute: 'workspace' // optional - nested relation field
 *     }
 *   }
 * ]
 */
export default (config: Config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    if (!ctx.state.user) {
      return await next();
    }

    const loggedUserUserGroup = await strapi.db
      .query('plugin::multi-tenant.user-group')
      .findOne({
        where: {
          users: {
            id: { $in: [ctx.state.user.id] },
          },
        },
      });

    if (!loggedUserUserGroup) {
      return await next();
    }

    // Get all allowed user group IDs (including children in hierarchy)
    const allowedUserGroupIds = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .findAllowed(ctx.state.user.id);

    // Add filter to query
    ctx.query = {
      ...ctx.query,
      filters: {
        ...ctx.query?.filters,
        ...(config.attribute
          ? {
              [config.attribute]: {
                userGroup: { id: { $in: allowedUserGroupIds } },
              },
            }
          : { userGroup: { id: { $in: allowedUserGroupIds } } }),
      },
    };

    await next();
  };
};
