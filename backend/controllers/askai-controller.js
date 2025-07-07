// main.js  (CommonJS)
require("dotenv").config();          // load env vars early
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports.main = async (req, res) => {
  try {
    const { content = "" } = req.body;

    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [{ role: "user", content }],
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);
    res.status(500).send("Internal Server Error");
  }
};
