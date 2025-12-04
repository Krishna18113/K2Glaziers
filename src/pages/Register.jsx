import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Mantine Components
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Group,
  Text,   // <--- Added this
  Anchor  // <--- Added this
} from "@mantine/core";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    if (!phone.startsWith("+91")) {
      return alert("Enter phone number in +91XXXXXXXXXX format.");
    }
    if (password.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        username,
        email,
        phone,
        role: "staff",
        approved: false,
        createdAt: serverTimestamp(),
      });

      alert("Registered! Wait for admin approval.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper shadow="lg" radius="md" p="xl" className="w-[380px]">
        <Title order={2} className="text-center mb-4">
          Register
        </Title>

        <form onSubmit={register} className="space-y-3">
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextInput
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
            <Button fullWidth size="md" color="blue" type="submit">
              Register
            </Button>
          </Group>
        </form>

        {/* --- NAVIGATION LINK ADDED HERE --- */}
        <Text ta="center" mt="md" size="sm">
          Already have an account?{' '}
          <Anchor component="button" onClick={() => navigate('/login')}>
            Login
          </Anchor>
        </Text>

      </Paper>
    </div>
  );
}