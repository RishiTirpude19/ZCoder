const axios = require("axios");
require("dotenv").config(); // Ensure this is loaded early

module.exports.main = async (req, res, next) => {
  try {
    const content = req.body.content;

    const response = await axios.post(
      process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const completion = response.data.choices[0]?.message?.content || "";
    res.json({ message: completion });
  } catch (error) {
    console.error("Error fetching response from Groq API:", error.response?.data || error.message);
    res.status(500).send("Internal Server Error");
  }
};
