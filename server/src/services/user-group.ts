import type { Core } from '@strapi/strapi';

const userGroup = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Find all user groups
   */
  async find(params: any = {}) {
    return strapi.documents('plugin::multi-tenant.user-group').findMany(params);
  },

  /**
   * Find one user group by document ID
   */
  async findOne(documentId: string, params: any = {}) {
    return strapi.documents('plugin::multi-tenant.user-group').findOne({
      documentId,
      ...params,
    });
  },

  /**
   * Create a new user group
   */
  async create(data: any) {
    return strapi.documents('plugin::multi-tenant.user-group').create({
      data,
    });
  },

  /**
   * Update a user group
   */
  async update(documentId: string, data: any) {
    return strapi.documents('plugin::multi-tenant.user-group').update({
      documentId,
      data,
    });
  },

  /**
   * Delete a user group
   */
  async delete(documentId: string) {
    return strapi.documents('plugin::multi-tenant.user-group').delete({
      documentId,
    });
  },

  /**
   * Find the user group for a user
   */
  async findByUser(userId: number) {
    return strapi.db.query('plugin::multi-tenant.user-group').findOne({
      where: {
        users: {
          id: { $in: [userId] },
        },
      },
      populate: ['organization', 'parent', 'children'],
    });
  },

  /**
   * Find all user groups a user has access to (including children in hierarchy)
   */
  async findAllowed(userId: number): Promise<number[]> {
    const loggedUserUserGroup = await strapi.db.query('plugin::multi-tenant.user-group').findOne({
      where: {
        users: {
          id: { $in: [userId] },
        },
      },
      populate: ['organization', 'organization.userGroups', 'organization.userGroups.parent'],
    });

    if (!loggedUserUserGroup) {
      return [];
    }

    const organizationUserGroups = loggedUserUserGroup.organization?.userGroups || [];

    // Build hierarchy path - find all child groups accessible from the user's group
    const findPath = (parentId: number, path: number[] = []): number[] => {
      const updatedPath = [...path, parentId];
      const foundGroup = organizationUserGroups.find(
        (group: any) => group.parent?.id === parentId
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
  async userBelongsTo(userId: number, userGroupId: number): Promise<boolean> {
    const allowedGroups = await this.findAllowed(userId);
    return allowedGroups.includes(userGroupId);
  },

  /**
   * Add a user to a user group
   */
  async addUser(userGroupId: string, userId: number) {
    const userGroup = await strapi.documents('plugin::multi-tenant.user-group').findOne({
      documentId: userGroupId,
      populate: ['users'],
    });

    if (!userGroup) {
      throw new Error('User group not found');
    }

    const existingUserIds = userGroup.users?.map((u: any) => u.id) || [];
    if (existingUserIds.includes(userId)) {
      return userGroup; // User already in group
    }

    return strapi.documents('plugin::multi-tenant.user-group').update({
      documentId: userGroupId,
      data: {
        users: [...existingUserIds, userId],
      },
    });
  },

  /**
   * Remove a user from a user group
   */
  async removeUser(userGroupId: string, userId: number) {
    const userGroup = await strapi.documents('plugin::multi-tenant.user-group').findOne({
      documentId: userGroupId,
      populate: ['users'],
    });

    if (!userGroup) {
      throw new Error('User group not found');
    }

    const existingUserIds = userGroup.users?.map((u: any) => u.id) || [];
    const newUserIds = existingUserIds.filter((id: number) => id !== userId);

    return strapi.documents('plugin::multi-tenant.user-group').update({
      documentId: userGroupId,
      data: {
        users: newUserIds,
      },
    });
  },
});

export default userGroup;
