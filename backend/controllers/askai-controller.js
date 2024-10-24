const axios = require("axios")


module.exports.main = async (req, res, next) => {
  try {
    const content = req.body.content;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
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
        },
      }
    );

    const completion = response.data.choices[0]?.message?.content || "";
    res.json({ message: completion });
  } catch (error) {
    console.error("Error fetching response from Groq API:", error);
    res.status(500).send("Internal Server Error");
  }
};
