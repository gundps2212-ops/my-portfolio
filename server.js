const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

        await transporter.sendMail({
            from: process.env.EMAIL,
            replyTo: email,
            to: process.env.EMAIL,
            subject: "New Portfolio Message",
            html: `
                <h2>New Contact Form Submission</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b> ${message}</p>
            `
        });

        res.json({ message: "Message Sent Successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to Send Message" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});