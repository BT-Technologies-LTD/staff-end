import express from "express";
import dotenv from "dotenv";
import { auth, db } from "../data/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("login");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const staffDocRef = doc(db, "staff_list", user.uid);
    const staffDoc = await getDoc(staffDocRef);

    if (staffDoc.exists()) {
      req.session.user = {
        uid: user.uid,
        ...staffDoc.data(),
        lastUpdate: Date.now(),
      };

      return res.redirect("/dashboard");
    } else {
      req.flash("error", "Staff data not found");
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error.message.match(/[^:]+:(.*)/);
    const userFriendlyMessage = errorMessage
      ? errorMessage[1].trim()
      : "An error occurred";

    req.flash("error", userFriendlyMessage);
    res.redirect("/");
  }
});

export default router;
