document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        displayResponse(data);

    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
    }
});

function displayResponse(data) {
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = '';

    data.forEach((document, index) => {
        const documentDiv = document.createElement('div');
        documentDiv.classList.add('document');

        documentDiv.innerHTML = `
            <h3>Documento ${index + 1}</h3>
            <h4>Páginas:</h4>
            <ul>
                ${document.pages.map(page => `<li>- ${page.pageNumber}</li>`).join('')}
            </ul>
            <h4>Tabelas:</h4>
            <ul>
                ${document.tables.map(table => `<li>- ${table.columnCount} colunas, ${table.rowCount} linhas</li>`).join('')}
            </ul>
        `;

        responseDiv.appendChild(documentDiv);
    });
}
