# Strapi Plugin Multi-Tenant (v5)

A Strapi 5 plugin to make Strapi a full-fledged backend for your SaaS.

> **Note:** This is a Strapi 5 compatible fork of [strapi-plugin-multi-tenant](https://github.com/anetaj/strapi-plugin-multi-tenant) by Aneta Jastrzębska.

## Features

- **Organizations**: Top-level tenant entities (companies, teams, customers)
- **User Groups**: Subdivisions within organizations with hierarchical support
- **Data Isolation**: Automatic filtering of content by user's organization/group
- **Middlewares & Policies**: Ready-to-use access control helpers

## Installation

```bash
npm install strapi-plugin-multi-tenant-v5
# or
yarn add strapi-plugin-multi-tenant-v5
```

## Configuration

Enable the plugin in `./config/plugins.ts`:

```typescript
export default () => ({
  'multi-tenant': {
    enabled: true,
  },
});
```

Then rebuild your admin panel:

```bash
npm run build
# or
yarn build
```

## How It Works

### Organization and UserGroup

**Organization** is a single business entity—for example, Google or Microsoft.

**UserGroup** is a group of users within an Organization. Most commonly, it's a department name (Engineering, Product) or a geographical division (Microsoft EMEA, Microsoft APAC).

UserGroups can optionally create a hierarchy. For example, "Acme HQ" could have "Acme Engineering" and "Acme Product" as children. Users assigned to "Engineering" have access to content from Engineering and its child groups.

A User can only belong to one UserGroup.

### Data Isolation

The plugin provides two ways to isolate data:

1. **Policy**: Only lets users modify resources belonging to their UserGroup
2. **Middleware**: Enforces creating and fetching resources for their UserGroup

## Usage

### 1. Add userGroup relation to your content types

For any content type you want to isolate by tenant, add a relation to `user-group`:

```json
{
  "attributes": {
    "userGroup": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::multi-tenant.user-group"
    }
  }
}
```

### 2. Configure routes with middleware

For **GET (find)** routes, add the filter middleware:

```typescript
// src/api/workspace/routes/workspace.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/workspaces',
      handler: 'workspace.find',
      config: {
        middlewares: [
          'plugin::multi-tenant.find-same-user-group',
        ],
      },
    },
  ],
};
```

For **POST (create)** routes, add the assignment middleware:

```typescript
{
  method: 'POST',
  path: '/workspaces',
  handler: 'workspace.create',
  config: {
    middlewares: [
      'plugin::multi-tenant.add-same-user-group',
    ],
  },
}
```

### 3. Configure routes with policy

For **GET/:id, PUT/:id, DELETE/:id** routes, add the policy:

```typescript
{
  method: 'PUT',
  path: '/workspaces/:id',
  handler: 'workspace.update',
  config: {
    policies: [
      {
        name: 'plugin::multi-tenant.is-same-user-group',
        config: {
          contentType: 'api::workspace.workspace',
        },
      },
    ],
  },
}
```

### Nested Relations

If your content type doesn't have a direct `userGroup` relation but relates to something that does (e.g., `Note` → `Workspace` → `UserGroup`), use the `attribute` config:

```typescript
// For Notes that belong to Workspaces
{
  method: 'GET',
  path: '/notes',
  handler: 'note.find',
  config: {
    middlewares: [
      {
        name: 'plugin::multi-tenant.find-same-user-group',
        config: {
          attribute: 'workspace', // Notes link through workspace
        },
      },
    ],
  },
}
```

## API Endpoints

### Content API (for frontend use)

- `GET /api/multi-tenant/my-organization` - Get current user's organization
- `GET /api/multi-tenant/my-user-group` - Get current user's user group

### Admin API

- `GET/POST /multi-tenant/organizations` - CRUD for organizations
- `GET/POST /multi-tenant/user-groups` - CRUD for user groups
- `POST /multi-tenant/user-groups/:id/add-user` - Add user to group
- `POST /multi-tenant/user-groups/:id/remove-user` - Remove user from group

## Services

Access the plugin services in your custom code:

```typescript
// Get user's organization
const org = await strapi
  .plugin('multi-tenant')
  .service('organization')
  .findByUser(userId);

// Get user's allowed user groups (including hierarchy)
const allowedGroups = await strapi
  .plugin('multi-tenant')
  .service('user-group')
  .findAllowed(userId);

// Check if user belongs to a group
const belongs = await strapi
  .plugin('multi-tenant')
  .service('user-group')
  .userBelongsTo(userId, groupId);
```

## License

MIT

## Credits

Original Strapi 4 plugin by [Aneta Jastrzębska](https://github.com/anetaj/strapi-plugin-multi-tenant).
Strapi 5 adaptation by Felix Iim.
