import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  Group,
  Button,
  Title,
  Burger,
  Drawer,
  Stack,
  Paper,
  Avatar,
  Text,
  Divider,
  Box
} from "@mantine/core";

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/register") return null;
  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
    setOpened(false);
  };

  const close = () => setOpened(false);

  return (
    <>
      <Paper shadow="xs" p="md" className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Group justify="space-between">
          <div 
            className="cursor-pointer" 
            onClick={() => navigate(profile?.role === 'admin' ? '/admin' : '/sell')}
          >
            <Title order={3} className="text-blue-700">K2 Glaziers</Title>
          </div>

          {/* DESKTOP MENU */}
          <Group visibleFrom="sm" gap="xs">
            <Button variant="subtle" onClick={() => navigate("/sell")}>Sell</Button>
            <Button variant="subtle" onClick={() => navigate("/returns")}>Returns</Button>
            {/* SINGLE BUTTON FOR ALL HISTORY */}
            <Button variant="subtle" onClick={() => navigate("/history")}>History</Button>
            
            {profile?.role === "admin" && (
              <>
                <Button variant="subtle" color="orange" onClick={() => navigate("/inventory")}>Inventory</Button>
                <Button variant="subtle" color="orange" onClick={() => navigate("/admin")}>Dashboard</Button>
              </>
            )}

            <Button color="red" variant="outline" size="xs" onClick={handleLogout} ml="md">
              Logout
            </Button>
          </Group>

          <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="sm" size="sm" />
        </Group>
      </Paper>

      {/* MOBILE DRAWER */}
      <Drawer opened={opened} onClose={close} title="Menu" padding="md" size="75%" position="right">
        <Stack gap="md">
          <Box className="bg-gray-100 p-3 rounded-md mb-2">
            <Group>
              <Avatar color="blue" radius="xl">{profile?.username?.[0]?.toUpperCase()}</Avatar>
              <div>
                <Text fw={600} size="sm">{profile?.username || "User"}</Text>
                <Text size="xs" c="dimmed" tt="uppercase">{profile?.role || "Staff"}</Text>
              </div>
            </Group>
          </Box>

          <Text size="sm" c="dimmed" fw={700} mt="xs">DAILY OPERATIONS</Text>
          <Button fullWidth variant="light" size="md" onClick={() => { navigate("/sell"); close(); }}>
            🛒 Sell Items
          </Button>
          <Button fullWidth variant="light" size="md" onClick={() => { navigate("/returns"); close(); }}>
            ↩️ Returns
          </Button>
          {/* SINGLE BUTTON FOR MOBILE TOO */}
          <Button fullWidth variant="subtle" onClick={() => { navigate("/history"); close(); }}>
            📜 Records & History
          </Button>

          {profile?.role === "admin" && (
            <>
              <Divider my="sm" />
              <Text size="sm" c="dimmed" fw={700}>ADMIN CONTROLS</Text>
              <Button fullWidth variant="filled" color="blue" onClick={() => { navigate("/admin"); close(); }}>
                 📊 Dashboard
              </Button>
              <Button fullWidth variant="outline" color="blue" onClick={() => { navigate("/inventory"); close(); }}>
                 📦 Manage Inventory
              </Button>
            </>
          )}

          <Divider my="md" />
          <Button fullWidth color="red" onClick={handleLogout}>Logout</Button>
        </Stack>
      </Drawer>
    </>
  );
}