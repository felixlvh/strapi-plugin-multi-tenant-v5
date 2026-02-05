import type { Core } from '@strapi/strapi';

const organization = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Find all organizations
   */
  async find(params: any = {}) {
    return strapi.documents('plugin::multi-tenant.organization').findMany(params);
  },

  /**
   * Find one organization by document ID
   */
  async findOne(documentId: string, params: any = {}) {
    return strapi.documents('plugin::multi-tenant.organization').findOne({
      documentId,
      ...params,
    });
  },

  /**
   * Find organization by slug
   */
  async findBySlug(slug: string) {
    const results = await strapi.documents('plugin::multi-tenant.organization').findMany({
      filters: { slug },
      limit: 1,
    });
    return results[0] || null;
  },

  /**
   * Create a new organization
   */
  async create(data: any) {
    return strapi.documents('plugin::multi-tenant.organization').create({
      data,
    });
  },

  /**
   * Update an organization
   */
  async update(documentId: string, data: any) {
    return strapi.documents('plugin::multi-tenant.organization').update({
      documentId,
      data,
    });
  },

  /**
   * Delete an organization
   */
  async delete(documentId: string) {
    return strapi.documents('plugin::multi-tenant.organization').delete({
      documentId,
    });
  },

  /**
   * Get organization for a user
   */
  async findByUser(userId: number) {
    const userGroup = await strapi.db.query('plugin::multi-tenant.user-group').findOne({
      where: {
        users: {
          id: { $in: [userId] },
        },
      },
      populate: ['organization'],
    });

    return userGroup?.organization || null;
  },
});

export default organization;
