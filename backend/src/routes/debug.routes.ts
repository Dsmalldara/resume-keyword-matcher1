import { Router } from "express";
import {supabase} from "../lib/supabase";
import { AuthMiddleware } from "../middleware/auth";


const router = Router()
router.get("/test-storage", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase.storage
      .from("resumes")
      .list("", { limit: 100 });

    res.json({ 
      userId,

      files: data ,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});
export default router;