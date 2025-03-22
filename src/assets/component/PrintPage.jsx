// Importa o React e o hook useState da biblioteca react
import React, { useState } from 'react';

//Importa o arquivo de estilos PrintPage.css
import './PrintPage.css';

//componente responsável por toda a lógica e renderização da interface do usuário.
const PrintPage = () => {

  // Armazena a URL digitada pelo usuário.
  const [url, setUrl] = useState('');

  //Armazena a URL da imagem capturada.
  const [imageUrl, setImageUrl] = useState('');

  // Armazena a imagem capturada para exibição.
  const [image, setImage] = useState(null);

  //Controla a visibilidade do botão de download.
  const [buttonVisible, setButtonVisible] = useState(false);

  //Controla o estado de carregamento enquanto a captura está em andamento.
  const [loading, setLoading] = useState(false);

  //Armazena mensagens de erro, se houver
  const [error, setError] = useState('');

  // função handlePrint  que é chamada quando o usuário clica no botão "Tirar Print".
  const handlePrint = async () => {

    // Verifica se a URL foi fornecida. Se não, define uma mensagem de erro e interrompe a execução.
    if (!url) {
      setError('Por favor, insira uma URL válida.');
      return;
    }

    //define o estado loading como true para mostrar que a captura está em andamento.
    setLoading(true);

    //Limpa qualquer mensagem de erro anterior.
    setError('');

    //Inicia um bloco try para capturar erros durante a requisição.
    try {

      //Faz uma requisição para o backend (servidor Node.js) para capturar a screenshot da URL fornecida.
      const response = await fetch(`http://localhost:3000/capture?url=${encodeURIComponent(url)}`);

      // verifica se a resposta da requisição foi bem-sucedida. Se não, lança um erro.
      if (!response.ok) {
        throw new Error('Erro ao capturar a página');
      }

      // Converte a resposta da requisição em um Blob objeto  que representa a imagem.
      const blob = await response.blob();

      // Cria uma URL temporária para o Blob usando URL.createObjectURL. Essa URL pode ser usada para exibir a imagem.
      const imageUrl = URL.createObjectURL(blob);

      // Armazena a URL da imagem no estado imageUrl
      setImageUrl(imageUrl);

      // armazena a URL da imagem no estado image para exibição.
      setImage(imageUrl);

      // Define buttonVisible como true para mostrar o botão de download.
      setButtonVisible(true);

      //limpa o campo de URL.
      setUrl('');

      //Captura erros que ocorrem durante a requisição.
    } catch (error) {

      //Exibe o erro no console.
      console.error('Erro ao capturar a página:', error);

      //Define uma mensagem de erro no estado error
      setError('Erro ao capturar a página. Verifique a URL e tente novamente.');

      // bloco finally 
    } finally {
      setLoading(false);
    }
  };
  //chamada quando o usuário clica no botão "Baixar Imagem".
  const downloadImage = () => {
    //Cria um elemento <a> temporário.
    const link = document.createElement('a');

    //Define o atributo href do link como a URL da imagem
    link.href = imageUrl;

    // define o atributo download para forçar o download da imagem 
    link.download = 'pagina-capturada.png';

    //Adiciona o link ao corpo do documento
    document.body.appendChild(link);
    //Simula um clique no link para iniciar o download
    link.click();

    //Remove o link do documento após o download.
    document.body.removeChild(link);
  };

  // Retorna o JSX que define a estrutura do componente
  return (
    //contêiner principal
    <div id="container-principal">
      <h1>Capturar Print da Página</h1>
      <p>Copie e cole o link da página da qual deseja tirar o print abaixo</p>

      {/* container secundario*/}
      <div id="container-secundario">
        <textarea
          rows="2"
          cols="50"
          type="text"
          placeholder="Digite a URL"

          //Controla o valor do campo usando o estado url.
          value={url}

          //Atualiza o estado url quando o usuário digita algo.
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* botão para capturar a screenshot chama handlePrint e Desabilita o botão enquanto loading for true*/}
        <button onClick={handlePrint} id="buttonPrint" disabled={loading}>
          {loading ? 'Caregando...' : 'Tirar Print'}
        </button>
        {/*Exibe uma mensagem de erro  se o estado error não estiver vazio. */ }
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/*Exibe a imagem capturada se o estado image não estiver vazio. */}
        {image && (
          <img id='img-print'
            src={image}
            alt="Captured Page"
          />
        )}
        {/*Exibe o botão de download se buttonVisible for true ,Chama a função downloadImage quando o botão é clicado. */}
        {buttonVisible && (
          <button id="download-button" onClick={downloadImage}>
            Baixar Imagem
          </button>
        )}
      </div>
    </div>
  );
};

export default PrintPage;