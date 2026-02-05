import type { Core } from '@strapi/strapi';

const userGroup = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx: any) {
    const entities = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .find(ctx.query);

    return { data: entities };
  },

  async findOne(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .findOne(id, ctx.query);

    if (!entity) {
      return ctx.notFound('User group not found');
    }

    return { data: entity };
  },

  async create(ctx: any) {
    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .create(ctx.request.body.data || ctx.request.body);

    return { data: entity };
  },

  async update(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .update(id, ctx.request.body.data || ctx.request.body);

    return { data: entity };
  },

  async delete(ctx: any) {
    const { id } = ctx.params;
    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .delete(id);

    return { data: entity };
  },

  async me(ctx: any) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .findByUser(ctx.state.user.id);

    if (!entity) {
      return ctx.notFound('User does not belong to any group');
    }

    return { data: entity };
  },

  async addUser(ctx: any) {
    const { id } = ctx.params;
    const { userId } = ctx.request.body;

    if (!userId) {
      return ctx.badRequest('userId is required');
    }

    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .addUser(id, userId);

    return { data: entity };
  },

  async removeUser(ctx: any) {
    const { id } = ctx.params;
    const { userId } = ctx.request.body;

    if (!userId) {
      return ctx.badRequest('userId is required');
    }

    const entity = await strapi
      .plugin('multi-tenant')
      .service('user-group')
      .removeUser(id, userId);

    return { data: entity };
  },
});

export default userGroup;
