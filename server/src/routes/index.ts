export default {
  admin: {
    type: 'admin',
    routes: [
      // Organization routes
      {
        method: 'GET',
        path: '/organizations',
        handler: 'organization.find',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/organizations/:id',
        handler: 'organization.findOne',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/organizations',
        handler: 'organization.create',
        config: {
          policies: [],
        },
      },
      {
        method: 'PUT',
        path: '/organizations/:id',
        handler: 'organization.update',
        config: {
          policies: [],
        },
      },
      {
        method: 'DELETE',
        path: '/organizations/:id',
        handler: 'organization.delete',
        config: {
          policies: [],
        },
      },
      // User Group routes
      {
        method: 'GET',
        path: '/user-groups',
        handler: 'user-group.find',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/user-groups/:id',
        handler: 'user-group.findOne',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/user-groups',
        handler: 'user-group.create',
        config: {
          policies: [],
        },
      },
      {
        method: 'PUT',
        path: '/user-groups/:id',
        handler: 'user-group.update',
        config: {
          policies: [],
        },
      },
      {
        method: 'DELETE',
        path: '/user-groups/:id',
        handler: 'user-group.delete',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/user-groups/:id/add-user',
        handler: 'user-group.addUser',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/user-groups/:id/remove-user',
        handler: 'user-group.removeUser',
        config: {
          policies: [],
        },
      },
    ],
  },
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/my-organization',
        handler: 'organization.findByUser',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/my-user-group',
        handler: 'user-group.me',
        config: {
          policies: [],
        },
      },
    ],
  },
};
