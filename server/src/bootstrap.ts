import type { Core } from '@strapi/strapi';

const TENANT_ROLE_CODE = 'strapi-tenant';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  // Register plugin permissions
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'multi-tenant',
    },
    {
      section: 'plugins',
      displayName: 'Create',
      uid: 'create',
      pluginName: 'multi-tenant',
    },
    {
      section: 'plugins',
      displayName: 'Update',
      uid: 'update',
      pluginName: 'multi-tenant',
    },
    {
      section: 'plugins',
      displayName: 'Delete',
      uid: 'delete',
      pluginName: 'multi-tenant',
    },
  ];

  await strapi.admin?.services.permission.actionProvider.registerMany(actions);

  // Create Tenant role for customers if it doesn't exist
  const existingRole = await strapi.db.query('admin::role').findOne({
    where: { code: TENANT_ROLE_CODE }
  });

  if (!existingRole) {
    strapi.log.info('Creating Tenant role for multi-tenant customers...');
    
    const tenantRole = await strapi.db.query('admin::role').create({
      data: {
        name: 'Tenant',
        code: TENANT_ROLE_CODE,
        description: 'Limited access role for SaaS customers - can only manage their own content',
      }
    });

    // Assign basic content permissions to tenant role
    // They can create/read/update/delete content but with tenant filtering
    const contentTypePermissions = [
      // Content Manager - basic access
      'plugin::content-manager.explorer.create',
      'plugin::content-manager.explorer.read',
      'plugin::content-manager.explorer.update',
      'plugin::content-manager.explorer.delete',
      // Upload plugin - manage their media
      'plugin::upload.read',
      'plugin::upload.assets.create',
      'plugin::upload.assets.update',
      'plugin::upload.assets.download',
      'plugin::upload.assets.copy-link',
    ];

    for (const action of contentTypePermissions) {
      try {
        await strapi.db.query('admin::permission').create({
          data: {
            action,
            actionParameters: {},
            subject: null,
            properties: {},
            conditions: [],
            role: tenantRole.id,
          }
        });
      } catch (err) {
        // Permission might already exist or not be valid, skip
      }
    }

    strapi.log.info(`Tenant role created with ID: ${tenantRole.id}`);
  }
};
