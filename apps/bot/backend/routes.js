const express = require("express");
const router = express.Router();
const supabase = require("./supabaseClient");
const openai = require("./openaiClient");

// --- Rotas de Mensagens e Logs (já existentes) ---

router.get("/messages/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { data, error } = await supabase.from("inbox_messages").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { patient_id, patient_name, message, type, from, is_new_patient } = req.body;
    if (!patient_id || !patient_name || !message || !type || !from) return res.status(400).json({ message: "Campos obrigatórios faltando." });
    const { data, error } = await supabase.from("inbox_messages").insert([{ patient_id, patient_name, message, type, from, is_new_patient }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.post("/logs", async (req, res) => {
  try {
    const { user, action, details, sector } = req.body;
    if (!action) return res.status(400).json({ message: "O campo action é obrigatório." });
    const { error } = await supabase.from("inbox_system_logs").insert([{ user, action, details, sector }]);
    if (error) throw error;
    res.status(201).json({ message: "Log gravado." });
  } catch (error) {
    console.error("Erro ao gravar log:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.post("/interactions", async (req, res) => {
  try {
    const { patient_id, user_id, type, notes } = req.body;
    if (!patient_id || !type) return res.status(400).json({ message: "Campos obrigatórios faltando." });
    const { data, error } = await supabase.from("inbox_interactions").insert([{ patient_id, user_id, type, notes }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Erro ao gravar interação:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});


// --- Novas Rotas de IA ---

const aiRouter = express.Router();

aiRouter.post("/analyze-conversation", async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "patientId é obrigatório." });
    }

    // 1. Buscar o nome do paciente e as mensagens
    const { data: contactData, error: contactError } = await supabase
      .from("inbox_contacts")
      .select("name")
      .eq("patient_id", patientId)
      .single();

    if (contactError) throw contactError;

    const { data: messages, error: messagesError } = await supabase
      .from("inbox_messages")
      .select("message, from")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    // 2. Montar o histórico da conversa para a IA
    const conversationHistory = messages.map(m => `${m.from === 'patient' ? 'Paciente' : 'Clínica'}: ${m.message}`).join('\n');

    // 3. Montar o prompt para a OpenAI
    const prompt = `Analise a seguinte conversa com o paciente "${contactData.name}" e forneça um resumo, análise de sentimento (positivo, negativo, neutro), uma resposta sugerida e uma próxima ação recomendada (ex: 'schedule_appointment', 'send_info', 'follow_up'). A conversa é:\n\n${conversationHistory}\n\nResponda em formato JSON com as chaves: "summary", "sentiment", "suggested_reply", "action".`;

    // 4. Chamar a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou o modelo que você preferir
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // 5. Retornar a análise para o frontend
    res.status(200).json(analysis);

  } catch (error) {
    console.error("Erro ao analisar conversa:", error.message);
    res.status(500).json({ message: "Erro interno do servidor ao processar a análise da IA." });
  }
});

// Adiciona o novo roteador de IA ao principal
router.use("/ai", aiRouter);


module.exports = router;