import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Mantine UI
import {
  Card,
  Title,
  Text,
  Badge,
  List,
  Divider,
  Group,
} from "@mantine/core";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const snap = await getDocs(collection(db, "sales"));
    setSales(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  return (
    <div className="p-6">
      <Title order={2} className="mb-4">
        Sales History
      </Title>

      {sales.map((sale) => (
        <Card
          key={sale.id}
          shadow="md"
          radius="md"
          p="lg"
          className="mb-4 border"
        >
          <Group justify="space-between" align="center">
            <Text fw={600}>
              {new Date(sale.date.seconds * 1000).toLocaleString()}
            </Text>

            <Badge color="green" size="lg">
              ₹{sale.totalAmount}
            </Badge>
          </Group>

          <Divider my="sm" />

          <Text fw={600}>
            Customer: {sale.customerName} ({sale.customerPhone})
          </Text>

          <Text fw={600} mt="md">
            Items:
          </Text>

          <List spacing="xs" withPadding>
            {sale.items.map((i, idx) => (
              <List.Item key={idx}>
                {i.name} — ₹{i.price} × {i.quantity} ={" "}
                <strong>₹{i.amount}</strong>
              </List.Item>
            ))}
          </List>

          <Divider my="sm" />

          <Text fw={700} size="lg">
            Total Amount: ₹{sale.totalAmount}
          </Text>
        </Card>
      ))}
    </div>
  );
}
