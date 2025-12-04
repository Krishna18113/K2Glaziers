import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { logChange } from "../utils/logChange";

// Mantine UI imports
import {
  Card,
  Button,
  Table,
  Textarea,
  Title,
  Group,
  Paper,
  Divider,
  ScrollArea,
  Badge,
  Select,
} from "@mantine/core";

export default function Returns() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [reason, setReason] = useState("");

  // Load all sales
  useEffect(() => {
    async function loadSales() {
      const snap = await getDocs(collection(db, "sales"));
      setSales(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    loadSales();
  }, []);

  const addReturnItem = (item) => {
    const exists = returnItems.find((i) => i.name === item.name);
    if (exists) {
      exists.quantity += 1;
      setReturnItems([...returnItems]);
    } else {
      setReturnItems([...returnItems, { ...item, quantity: 1 }]);
    }
  };

  const removeReturnItem = (name) => {
    setReturnItems(returnItems.filter((i) => i.name !== name));
  };

  const completeReturn = async () => {
    if (!selectedSale || returnItems.length === 0)
      return alert("Select sale and add return items.");

    const returnData = {
      saleId: selectedSale.id,
      customerName: selectedSale.customerName || "Walk-in Customer",
      customerPhone: selectedSale.customerPhone || "",
      date: new Date(),
      items: returnItems.map((i) => ({ name: i.name, quantity: i.quantity, reason })),
    };

    await addDoc(collection(db, "returns"), returnData);

    const invSnap = await getDocs(collection(db, "inventory"));
    const inventoryMap = new Map();
    invSnap.docs.forEach((doc) => {
      inventoryMap.set(doc.data().name, { id: doc.id, ...doc.data() });
    });

    for (const item of returnItems) {
      const product = inventoryMap.get(item.name);
      if (product) {
        const ref = doc(db, "inventory", product.id);
        const newStock = product.stock + item.quantity;

        await updateDoc(ref, { stock: newStock });

        logChange({
          productId: product.id,
          productName: product.name,
          field: "stock",
          oldValue: product.stock,
          newValue: newStock,
          reason: `Return from Sale ID ${selectedSale.id} - ${reason}`,
        });
      }
    }

    alert("Return processed successfully!");
    setReturnItems([]);
    setSelectedSale(null);
    setReason("");
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <Title order={2} className="mb-4">Process Returns</Title>

      {/* Sales Selector */}
      <Card shadow="sm" radius="md" p="lg" className="mb-6">
        <Title order={4} className="mb-3">Select Sale</Title>
        <Select
          placeholder="Choose a sale"
          data={sales.map((s) => ({
            value: s.id,
            label: `${s.customerName || "Walk-in"} — ₹${s.totalAmount}`,
          }))}
          value={selectedSale?.id || null}
          onChange={(id) => setSelectedSale(sales.find((s) => s.id === id))}
        />
      </Card>

      {selectedSale && (
        <>
          {/* Sale Items */}
          <Card shadow="sm" radius="md" p="lg" className="mb-6">
            <Group justify="space-between" className="mb-3">
              <Title order={4}>Sale Items</Title>
              <Badge color="blue">{selectedSale.items.length} items</Badge>
            </Group>

            <ScrollArea h={200}>
              <Table highlightOnHover striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Qty Sold</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedSale.items.map((item) => (
                    <Table.Tr key={item.name}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        <Button size="xs" onClick={() => addReturnItem(item)}>
                          Return
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>

          {/* Return Items */}
          <Card shadow="sm" radius="md" p="lg" className="mb-6">
            <Title order={4} className="mb-3">Return Items</Title>

            {returnItems.length === 0 && <p>No items selected.</p>}

            {returnItems.map((item) => (
              <Paper key={item.name} shadow="xs" radius="md" p="md" className="mb-3 flex justify-between items-center">
                <div>
                  {item.name} — Qty: {item.quantity}
                </div>
                <Button color="red" size="xs" onClick={() => removeReturnItem(item.name)}>
                  Remove
                </Button>
              </Paper>
            ))}

            {returnItems.length > 0 && (
              <>
                <Divider className="my-4" />
                <Textarea
                  label="Reason for Return"
                  placeholder="e.g. Broken, Wrong Item"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  autosize
                />
                  <Button fullWidth color="green" size="md" className="mt-4" onClick={completeReturn}>
                    Complete Return
                  </Button>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
