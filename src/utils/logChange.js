import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logChange({ productId, productName, field, oldValue, newValue, reason }) {
  const user = auth.currentUser;

  await addDoc(collection(db, "changes"), {
    productId,
    productName,
    field,
    oldValue,
    newValue,
    reason: reason || "Not specified",
    changedBy: user ? user.email : "Unknown User",
    timestamp: serverTimestamp(),
  });
}
