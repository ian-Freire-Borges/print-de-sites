//Importa o framework express, que é usado para criar o servidor web.
const express = require('express');

//Importa o pacote cors, que permite que o servidor aceite requisições de diferentes origens
const cors = require('cors');

//Importa o puppeteer, uma biblioteca que controla o navegador Chrome/Chromium para capturar screenshots.
const puppeteer = require('puppeteer');

// Para salvar a imagem localmente
const fs = require('fs'); 

//cria uma instância do express e a armazena na variável app
const app = express();
//Define a porta em que o servidor vai rodar  a porta 3000
const port = 3000;

//Habilita o middleware cors para nao ter problemas de CORS
app.use(cors());

//Define uma rota get
app.get('/capture', async (req, res) => {

  //Extrai o parâmetro url da query string da requisição.
  const { url } = req.query;
  //verifica se a URL foi fornecida
  if (!url) {
    return res.status(400).send('URL é obrigatória');
  }

  let browser;
  //bloco try para captura de erros
  try {
    //Inicia o navegador headless usando o puppeteer.launch.  
    browser = await puppeteer.launch({
      //Passa argumentos para o navegado
      args: [
        //Desabilitam o sandbox do Chrome 
        '--no-sandbox',
        '--disable-setuid-sandbox',
        //Evita problemas de memória
        '--disable-dev-shm-usage',
        // Desabilitam a aceleração de hardware 
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        //Roda o navegador em modo headless 
        '--headless',
      ],
    });

    // Abre uma nova página 
    const page = await browser.newPage();

    // Define o viewport como 1280x720 pixels.
    await page.setViewport({ width: 1280, height: 720 });

    //Navega até a URL usando page.goto , waitUntil networkidle2 Espera até que não haja mais requisições pendentes por 500ms
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    //Captura a screenshot da página como png
    const screenshot = await page.screenshot({ type: 'png' });

    // Salva a imagem localmente para verificar integridade
    fs.writeFileSync('temp_screenshot.png', screenshot);

    // Envia a imagem
    res.set('Content-Type', 'image/png');
    res.end(screenshot, 'binary');
    //captura de erros
  } catch (error) {
    console.error('Erro ao capturar a página:', error);
    res.status(500).send('Erro ao capturar a página');
  } finally {
    //Verifica se o navegador foi iniciado.
    if (browser) {
      //Fecha o navegador.
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
