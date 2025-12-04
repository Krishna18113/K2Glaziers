import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { logChange } from "../utils/logChange";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Mantine
import {
  Card,
  Button,
  Table,
  TextInput,
  Title,
  Group,
  Paper,
  Divider,
  ScrollArea,
  Badge,
} from "@mantine/core";

export default function Sell() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const snap = await getDocs(collection(db, "inventory"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  function addToCart(product) {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      exists.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function generateInvoice(sale) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Customer: ${sale.customerName}`, 14, 37);
    doc.text(`Phone: ${sale.customerPhone}`, 14, 44);

    const tableData = sale.items.map((item) => [
      item.name,
      item.price,
      item.quantity,
      item.amount,
    ]);

    doc.autoTable({
      head: [["Item", "Price", "Qty", "Amount"]],
      body: tableData,
      startY: 55,
    });

    doc.setFontSize(14);
    doc.text(`Total: ₹${sale.totalAmount}`, 14, doc.lastAutoTable.finalY + 15);

    doc.save(`invoice_${Date.now()}.pdf`);
  }

  async function completeSale() {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!customerName || !customerPhone)
      return alert("Enter customer name & phone!");

    const saleData = {
      customerName,
      customerPhone,
      date: new Date(),
      totalAmount,
      items: cart.map((c) => ({
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        amount: c.price * c.quantity,
      })),
    };

    await addDoc(collection(db, "sales"), saleData);

    for (const item of cart) {
      const ref = doc(db, "inventory", item.id);
      const newStock = item.stock - item.quantity;

      await updateDoc(ref, { stock: newStock });

      logChange({
        productId: item.id,
        productName: item.name,
        field: "stock",
        oldValue: item.stock,
        newValue: newStock,
        reason: `Sale to ${customerName}`,
      });
    }

    alert("Sale completed!");

    generateInvoice(saleData);

    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    loadInventory();
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <Title order={2} className="mb-4">
        Sell Products
      </Title>

      {/* CUSTOMER DETAILS */}
      <Card shadow="sm" radius="md" p="lg" className="mb-6">
        <Title order={4} className="mb-3">
          Customer Details
        </Title>

        <div className="grid grid-cols-1 gap-3">
          <TextInput
            label="Customer Name"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <TextInput
            label="Customer Phone"
            placeholder="Enter phone number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </Card>

      {/* INVENTORY */}
      <Card shadow="sm" radius="md" p="lg" className="mb-6">
        <Group justify="space-between" className="mb-3">
          <Title order={4}>Inventory</Title>
          <Badge color="blue" size="lg">
            {products.length} items
          </Badge>
        </Group>

        <ScrollArea h={250}>
          <Table highlightOnHover withColumnBorders striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {products.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td>₹{p.price}</Table.Td>
                  <Table.Td>{p.stock}</Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                    >
                      Add
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* CART */}
      <Card shadow="sm" radius="md" p="lg">
        <Title order={4} className="mb-3">
          Cart
        </Title>

        {cart.length === 0 && <p>No items added.</p>}

        {cart.map((item) => (
          <Paper
            key={item.id}
            shadow="xs"
            radius="md"
            p="md"
            className="mb-3 flex justify-between items-center"
          >
            <div>
              {item.name} — ₹{item.price} × {item.quantity}
            </div>

            <Button color="red" size="xs" onClick={() => removeFromCart(item.id)}>
              Remove
            </Button>
          </Paper>
        ))}

        {cart.length > 0 && (
          <>
            <Divider className="my-4" />

            <Title order={4}>Total: ₹{totalAmount}</Title>

            <Button
              fullWidth
              color="green"
              size="md"
              className="mt-4"
              onClick={completeSale}
            >
              Complete Sale
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
