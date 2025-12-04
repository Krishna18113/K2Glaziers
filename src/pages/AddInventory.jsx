import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  TextInput,
  NumberInput,
  Button,
  Card,
  Title,
  Group,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function AddInventory() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const addItem = async (e) => {
    e.preventDefault();

    if (!name || !stock) {
      showNotification({
        title: "Missing Fields",
        message: "Please enter both name and initial stock",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    try {
      await addDoc(collection(db, "inventory"), {
        name,
        stock: Number(stock),
        price: Number(price) || 0,
        createdAt: serverTimestamp(),
      });

      showNotification({
        title: "Item Added",
        message: "Inventory item added successfully 🎉",
        color: "green",
        icon: <IconCheck />,
      });

      setName("");
      setStock("");
      setPrice("");
    } catch (err) {
      showNotification({
        title: "Error",
        message: err.message,
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Card shadow="md" radius="md" p="lg" className="max-w-md mx-auto mt-6">
      <Title order={3} mb="lg">
        Add Inventory Item
      </Title>

      <form onSubmit={addItem}>
        <TextInput
          label="Item Name"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          mb="sm"
        />

        <NumberInput
          label="Initial Stock"
          placeholder="Enter quantity"
          value={stock}
          onChange={(val) => setStock(val)}
          required
          min={0}
          mb="sm"
        />

        <NumberInput
          label="Price (optional)"
          value={price}
          onChange={(val) => setPrice(val)}
          min={0}
          mb="lg"
        />

        <Group grow>
          <Button type="submit" size="md" variant="filled">
            Add Item
          </Button>
        </Group>
      </form>
    </Card>
  );
}
