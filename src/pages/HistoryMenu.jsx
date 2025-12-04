import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Title, SimpleGrid, Card, Text, ThemeIcon, Group } from "@mantine/core";
import { IconReceipt, IconArrowBackUp, IconHistory } from "@tabler/icons-react";

export default function HistoryMenu() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <Container size="sm" py="xl">
      <Title order={2} ta="center" mb="xl">Records & History</Title>

      <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="lg">
        
        {/* 1. SALES HISTORY (Everyone) */}
        <Card shadow="sm" padding="xl" radius="md" withBorder className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/sales-history')}>
          <Group>
            <ThemeIcon size={40} color="blue" variant="light">
              <IconReceipt size={24} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">Sales History</Text>
              <Text size="sm" c="dimmed">View all past sales and invoices</Text>
            </div>
          </Group>
        </Card>

        {/* 2. RETURN HISTORY (Everyone) */}
        <Card shadow="sm" padding="xl" radius="md" withBorder className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/return-history')}>
          <Group>
            <ThemeIcon size={40} color="red" variant="light">
              <IconArrowBackUp size={24} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">Return History</Text>
              <Text size="sm" c="dimmed">View record of returned items</Text>
            </div>
          </Group>
        </Card>

        {/* 3. CHANGE HISTORY (Admin Only) */}
        {profile?.role === 'admin' && (
          <Card shadow="sm" padding="xl" radius="md" withBorder className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/change-history')}>
            <Group>
              <ThemeIcon size={40} color="orange" variant="light">
                <IconHistory size={24} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="lg">Audit Logs (Admin)</Text>
                <Text size="sm" c="dimmed">Track who edited stock manually</Text>
              </div>
            </Group>
          </Card>
        )}

      </SimpleGrid>
    </Container>
  );
}