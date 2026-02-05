import type { Core } from '@strapi/strapi';

interface Config {
  attribute?: string;
  contentType?: string;
}

/**
 * Middleware to automatically assign userGroup when creating resources.
 * 
 * Usage in route config:
 * middlewares: [
 *   {
 *     name: 'plugin::multi-tenant.add-same-user-group',
 *     config: {
 *       attribute: 'workspace', // optional - link through a relation
 *       contentType: 'api::note.note' // required if attribute is set
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
      return ctx.badRequest('User does not belong to a user group');
    }

    // If linking through an attribute (e.g., note -> workspace -> userGroup)
    if (config.attribute) {
      if (!ctx.request.body?.data?.[config.attribute]) {
        return ctx.badRequest(`Request body must include ${config.attribute}`);
      }

      if (!config.contentType) {
        return ctx.badRequest('contentType must be configured when using attribute');
      }

      const contentType = strapi.contentType(config.contentType);
      const relationTarget = (contentType?.attributes?.[config.attribute] as any)?.target;

      if (relationTarget) {
        const foreignKey = ctx.request.body?.data?.[config.attribute];
        const attributeId = Number.isInteger(foreignKey) ? foreignKey : foreignKey?.id;

        const resourceToLink = await strapi.db.query(relationTarget).findOne({
          where: { id: attributeId },
          populate: ['userGroup'],
        });

        if (!resourceToLink) {
          return ctx.notFound(
            `Resource "${config.attribute}" with ID ${attributeId} not found`
          );
        }

        // Check if the linked resource belongs to user's group
        const allowedUserGroupIds = await strapi
          .plugin('multi-tenant')
          .service('user-group')
          .findAllowed(ctx.state.user.id);

        if (!allowedUserGroupIds.includes(resourceToLink.userGroup?.id)) {
          return ctx.forbidden('You do not have access to this resource');
        }

        ctx.request.body = {
          ...ctx.request.body,
          data: {
            ...ctx.request.body.data,
            [config.attribute]: resourceToLink,
          },
        };
      }
    } else {
      // Direct userGroup assignment
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...ctx.request.body?.data,
          userGroup: loggedUserUserGroup.id,
        },
      };
    }

    return await next();
  };
};
