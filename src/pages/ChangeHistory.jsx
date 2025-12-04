import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  Title,
  Card,
  Loader,
  Center,
  Text,
} from "@mantine/core";

export default function ChangeHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    const snap = await getDocs(collection(db, "changes"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Latest change first
    const sorted = data.sort(
      (a, b) =>
        (b.timestamp?.seconds || 0) -
        (a.timestamp?.seconds || 0)
    );

    setLogs(sorted);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Title order={2} className="mb-4">Exhange History</Title>

      <Card shadow="md" p="lg" radius="md">
        {loading ? (
          <Center p="lg">
            <Loader />
          </Center>
        ) : logs.length === 0 ? (
          <Center p="lg">
            <Text>No change logs recorded yet.</Text>
          </Center>
        ) : (
          <Table
            highlightOnHover
            verticalSpacing="sm"
            withTableBorder
            withColumnBorders
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Field</Table.Th>
                <Table.Th>Old</Table.Th>
                <Table.Th>New</Table.Th>
                <Table.Th>Changed By</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Reason</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {logs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>{log.productName || "-"}</Table.Td>
                  <Table.Td>{log.field}</Table.Td>
                  <Table.Td>{String(log.oldValue)}</Table.Td>
                  <Table.Td>{String(log.newValue)}</Table.Td>
                  <Table.Td>{log.changedBy || "System"}</Table.Td>
                  <Table.Td>
                    {log.timestamp?.seconds
                      ? new Date(
                          log.timestamp.seconds * 1000
                        ).toLocaleString()
                      : "-"}
                  </Table.Td>
                  <Table.Td>{log.reason || "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
