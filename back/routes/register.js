import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { db, storage, auth } from "../data/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import path from "path";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  const message = res.locals.messages.error ?? null;

  res.render("register", { error: message, formData: req.body });
});

router.post("/register", upload.single("profile_photo"), async (req, res) => {
  const {
    last_name,
    first_name,
    other_name,
    gender,
    branch,
    department,
    salary,
    phone_number,
    account_number,
    email,
    password,
    password_confirm,
  } = req.body;
  const profile_photo = req.file;

  if (password !== password_confirm) {
    req.flash("error", "Passwords do not match.");
    return res.render("register", {
      formData: req.body,
      error: "Passwords do not match.",
    });
  }

  let photoUrl = "";
  let user;
  let photoRef;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = userCredential.user;
    const staff_id = user.uid;

    if (profile_photo) {
      const ext = path.extname(profile_photo.originalname);
      const fileName = `${staff_id}${ext}`;
      const photoRef = ref(storage, `profile_photos/${fileName}`);
      const uploadTask = uploadBytesResumable(photoRef, profile_photo.buffer);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            try {
              photoUrl = await getDownloadURL(photoRef);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    }

    const staffCollRef = collection(db, "staff_list");
    const stafDocRef = doc(staffCollRef, staff_id);

    await setDoc(stafDocRef, {
      last_name,
      first_name,
      other_name,
      gender,
      phone_number,
      account_number,
      branch,
      department,
      salary,
      email,
      profile_photo_url: photoUrl,
    });

    req.flash("success", "You've been registered successfully!");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    if (user) {
      await user.delete().catch(() => {});
    }

    if (photoRef) {
      await deleteObject(photoRef).catch(() => {});
    }

    if (error.code == "auth/email-already-in-use") {
      req.flash("error", "Email is already registered");
      return res.redirect("/");
    }

    const errorMessage = error.message.match(/[^:]+:(.*)/);
    const userFriendlyMessage = errorMessage
      ? errorMessage[1].trim()
      : "An error occurred";

    req.flash("error", userFriendlyMessage);
    return res.render("register", {
      formData: req.body,
      error: userFriendlyMessage,
    });
  }
});

export default router;
