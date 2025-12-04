import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { logChange } from "../utils/logChange";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Mantine UI Imports
import {
  Card,
  Button,
  Table,
  Title,
  Group,
  ScrollArea,
  TextInput,
  Modal,
  NumberInput,
} from "@mantine/core";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [opened, setOpened] = useState(false);

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, "inventory"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStock = async (item) => {
    try {
      const numericNewStock = Number(newStock);

      await logChange({
        productId: item.id,
        productName: item.name,
        field: "stock",
        oldValue: item.stock,
        newValue: numericNewStock,
        reason: "Manual update via Inventory List",
      });

      await updateDoc(doc(db, "inventory", item.id), {
        stock: numericNewStock,
      });

      alert("Stock updated and logged!");
      setOpened(false);
      fetchItems();
    } catch (err) {
      alert("Failed to update stock");
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteDoc(doc(db, "inventory", id));
    fetchItems();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title order={2} className="mb-4">Inventory</Title>

      {/* Edit Modal */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Update Stock" centered>
        <NumberInput
          label="New Stock"
          value={newStock}
          onChange={setNewStock}
          min={0}
        />

        <Button fullWidth className="mt-4" onClick={() => updateStock(editItem)}>
          Save Changes
        </Button>
      </Modal>

      <Card shadow="sm" radius="md" p="lg">
        <ScrollArea h={450}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {items.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item.stock}</Table.Td>
                  <Table.Td>₹{item.price}</Table.Td>
                  <Table.Td>
                    <Group>
                      <Button
                        size="xs"
                        color="yellow"
                        onClick={() => {
                          setEditItem(item);
                          setNewStock(item.stock);
                          setOpened(true);
                        }}
                      >
                        Update
                      </Button>

                      <Button size="xs" color="red" onClick={() => deleteItem(item.id)}>
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
