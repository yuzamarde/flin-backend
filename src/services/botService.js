// /backend/services/botService.js

// Daftar pertanyaan dan jawaban
const botResponses = {
    "what is loan consolidation?": "Loan consolidation is the process of combining multiple loans into a single one with a single monthly payment, often with a lower interest rate.",
    "how can flin help me?": "FLIN can help you manage your finances, find the best loans, and consolidate your debts to reduce your financial burden.",
};

export const generateBotResponse = (message) => {
    const cleanedMessage = message.trim().toLowerCase();

    // Cari jawaban yang sesuai
    const response = botResponses[cleanedMessage];

    // Jika tidak ada jawaban yang tepat, berikan respons default
    return response || "I'm here to help. Please tell me more about what you need.";
};
