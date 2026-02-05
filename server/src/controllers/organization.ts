import type { Core } from '@strapi/strapi';

const organization = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: any) {
    const entities = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .find(ctx.query);

    return { data: entities };
  },

  async findOne(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .findOne(id, ctx.query);

    if (!entity) {
      return ctx.notFound('Organization not found');
    }

    return { data: entity };
  },

  async create(ctx: any) {
    const entity = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .create(ctx.request.body.data || ctx.request.body);

    return { data: entity };
  },

  async update(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .update(id, ctx.request.body.data || ctx.request.body);

    return { data: entity };
  },

  async delete(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .delete(id);

    return { data: entity };
  },

  async findByUser(ctx: any) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const entity = await strapi
      .plugin('multi-tenant')
      .service('organization')
      .findByUser(ctx.state.user.id);

    if (!entity) {
      return ctx.notFound('User does not belong to any organization');
    }

    return { data: entity };
  },
});

export default organization;
