import { Page, Layouts } from '@strapi/strapi/admin';
import { Box, Typography, Grid, Button } from '@strapi/design-system';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  return (
    <Layouts.Root>
      <Page.Main>
        <Page.Title>Multi-Tenant</Page.Title>
        <Box padding={8} background="neutral100">
          <Box paddingBottom={4}>
            <Typography variant="alpha">Multi-Tenant Plugin</Typography>
          </Box>
          <Box paddingBottom={6}>
            <Typography variant="epsilon" textColor="neutral600">
              Turn Strapi into a full-fledged backend for your SaaS with organization and user group isolation.
            </Typography>
          </Box>

          <Grid.Root gap={4}>
            <Grid.Item col={6} s={12}>
              <Box 
                padding={5} 
                background="neutral0" 
                hasRadius 
                shadow="tableShadow"
              >
                <Typography variant="delta" as="h2">🏢 Organizations</Typography>
                <Box paddingTop={2} paddingBottom={4}>
                  <Typography variant="omega" textColor="neutral600">
                    Manage your tenant organizations. Each organization can have multiple user groups.
                  </Typography>
                </Box>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/content-manager/collection-types/plugin::multi-tenant.organization')}
                >
                  Manage Organizations
                </Button>
              </Box>
            </Grid.Item>

            <Grid.Item col={6} s={12}>
              <Box 
                padding={5} 
                background="neutral0" 
                hasRadius 
                shadow="tableShadow"
              >
                <Typography variant="delta" as="h2">👥 User Groups</Typography>
                <Box paddingTop={2} paddingBottom={4}>
                  <Typography variant="omega" textColor="neutral600">
                    Manage user groups within organizations. Assign users to groups for data isolation.
                  </Typography>
                </Box>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/content-manager/collection-types/plugin::multi-tenant.user-group')}
                >
                  Manage User Groups
                </Button>
              </Box>
            </Grid.Item>
          </Grid.Root>

          <Box paddingTop={6}>
            <Typography variant="delta" as="h3">📖 How to Use</Typography>
            <Box paddingTop={3}>
              <Typography variant="omega" textColor="neutral600">
                1. Create an <strong>Organization</strong> for each tenant/customer.
              </Typography>
            </Box>
            <Box paddingTop={2}>
              <Typography variant="omega" textColor="neutral600">
                2. Create <strong>User Groups</strong> within each organization.
              </Typography>
            </Box>
            <Box paddingTop={2}>
              <Typography variant="omega" textColor="neutral600">
                3. Assign <strong>Users</strong> to their respective user groups.
              </Typography>
            </Box>
            <Box paddingTop={2}>
              <Typography variant="omega" textColor="neutral600">
                4. Add a <code>userGroup</code> relation to your content types for data isolation.
              </Typography>
            </Box>
            <Box paddingTop={2}>
              <Typography variant="omega" textColor="neutral600">
                5. Use the provided middlewares and policies to enforce access control.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Page.Main>
    </Layouts.Root>
  );
};

export { App };
