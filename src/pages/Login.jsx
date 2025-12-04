import { useState } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Mantine Components
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Group,
} from "@mantine/core";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    if (!phone.startsWith("+91")) {
      return alert("Enter phone number in +91XXXXXXXXXX format.");
    }

    try {
      const q = query(collection(db, "users"), where("phone", "==", phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return alert("Phone number not registered.");
      }

      const userData = snapshot.docs[0].data();
      const userEmail = userData.email;

      if (!userData.approved) {
        return alert("Admin has not approved your account yet.");
      }

      await signInWithEmailAndPassword(auth, userEmail, password);

      alert("Login successful!");

      if (userData.role === "admin") navigate("/admin");
      else navigate("/sell");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper shadow="lg" radius="md" p="xl" className="w-[380px]">
        <Title order={2} className="text-center mb-4">
          Login
        </Title>

        <form onSubmit={login} className="space-y-3">
          <TextInput
            label="Phone Number"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Group justify="center" mt="md">
            <Button fullWidth size="md" color="green" type="submit">
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
