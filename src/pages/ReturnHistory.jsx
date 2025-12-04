import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Table, Card, Title, ScrollArea, Badge, Group } from "@mantine/core";

export default function ReturnHistory() {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    loadReturns();
  }, []);

  async function loadReturns() {
    const snap = await getDocs(collection(db, "returns"));
    setReturns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Title order={2} className="mb-4">Return History</Title>

      <Card shadow="sm" radius="md" p="lg">
        <ScrollArea h={450}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Returned Qty</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Reason</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {returns.map((r) => {
                if (r.items && Array.isArray(r.items)) {
                  return r.items.map((item, index) => (
                    <Table.Tr key={`${r.id}-${index}`}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>
                        <Badge color="blue">{item.quantity}</Badge>
                      </Table.Td>
                      <Table.Td>{r.customerName}</Table.Td>
                      <Table.Td>
                        {r.date?.seconds
                          ? new Date(r.date.seconds * 1000).toLocaleString()
                          : "N/A"}
                      </Table.Td>
                      <Table.Td>{item.reason || "-"}</Table.Td>
                    </Table.Tr>
                  ));
                } else if (r.productName) {
                  return (
                    <Table.Tr key={r.id}>
                      <Table.Td>{r.productName} (Old Record)</Table.Td>
                      <Table.Td>
                        <Badge color="yellow">{r.returnedQty}</Badge>
                      </Table.Td>
                      <Table.Td>{r.customerName}</Table.Td>
                      <Table.Td>
                        {r.date?.seconds
                          ? new Date(r.date.seconds * 1000).toLocaleString()
                          : "N/A"}
                      </Table.Td>
                      <Table.Td>-</Table.Td>
                    </Table.Tr>
                  );
                } else {
                  return null;
                }
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
