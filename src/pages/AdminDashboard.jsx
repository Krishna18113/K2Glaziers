import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import {
  Card,
  Table,
  Button,
  Title,
  Group,
  Badge,
  Divider,
} from "@mantine/core";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveUser = async (uid) => {
    await updateDoc(doc(db, "users", uid), { approved: true });
    alert("User approved!");
    fetchUsers();
  };

  const deleteUser = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    await deleteDoc(doc(db, "users", uid));
    alert("User removed!");
    fetchUsers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <Title order={2} className="mb-6 text-center font-semibold">
        Admin Dashboard
      </Title>

      {/* Inventory Navigation Buttons */}
      <Card shadow="sm" radius="md" withBorder className="mb-6">
        <Group grow>
          <Link to="/inventory">
            <Button fullWidth color="blue" size="md">
              View Inventory
            </Button>
          </Link>

          <Link to="/inventory/add">
            <Button fullWidth color="green" size="md">
              Add Inventory Item
            </Button>
          </Link>
        </Group>
      </Card>

      {/* Users Table */}
      <Card shadow="sm" radius="md" withBorder>
        <Title order={4} className="mb-3">
          Registered Users
        </Title>

        <Divider className="mb-4" />

        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Username</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {users.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>{u.username}</Table.Td>
                <Table.Td>{u.phone}</Table.Td>

                <Table.Td>
                  {u.approved ? (
                    <Badge color="green">Approved</Badge>
                  ) : (
                    <Badge color="red">Pending</Badge>
                  )}
                </Table.Td>

                <Table.Td>
                  <Group gap="sm">
                    {!u.approved && (
                      <Button
                        color="green"
                        size="xs"
                        onClick={() => approveUser(u.id)}
                      >
                        Approve
                      </Button>
                    )}

                    <Button
                      color="red"
                      size="xs"
                      onClick={() => deleteUser(u.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
