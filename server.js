const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {
    AzureKeyCredential,
    DocumentAnalysisClient
} = require("@azure/ai-form-recognizer");

const app = express();
const port = 3000;

// Configurar o multer para lidar com uploads de arquivos
const upload = multer({ dest: 'uploads/' });

// Servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota para lidar com o upload de arquivos
app.post('/upload', upload.array('pdfs'), async (req, res) => {
    try {
        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        const responses = [];

        for (const file of req.files) {
            const buffer = fs.readFileSync(file.path);
            const poller = await client.beginAnalyzeDocument("prebuilt-invoice", buffer);
            const { pages, tables } = await poller.pollUntilDone();
            responses.push({ pages, tables });

            // Remover o arquivo após a análise
            fs.unlinkSync(file.path);
        }

        // Exibir as respostas em um campo rico
        res.send(responses);

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send('Erro ao processar os PDFs.');
    }
});

// Configurações do Azure
const key = "2bbedcbd919745caac1e7d57d5a19441";
const endpoint = "https://pdf-aut-ia.cognitiveservices.azure.com/";

app.listen(port, () => {
    console.log(`Aplicativo rodando em http://localhost:${port}`);
});
