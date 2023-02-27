/*
 * A classe AuthorizationValidator é responsável por validar a autorização de uma requisição HTTP. Ela recebe dois parâmetros no construtor: a senha para a criptografia e a validade do cabeçalho. A classe possui as seguintes funções:
 *
 * extractHeaders(req): essa função extrai o timestamp e os dados criptografados do cabeçalho da requisição HTTP e retorna um objeto contendo essas informações.
 *
 * generateIV(timestamp): essa função gera o vetor de inicialização (IV) a partir do timestamp passado como parâmetro. Ela utiliza a função de hash SHA-512 para gerar um hash a partir do timestamp e depois pega apenas os 16 primeiros bytes desse hash para usar como IV.
 *
 * decryptMessage(encryptedData, password, IV): essa função descriptografa os dados criptografados passados como parâmetro utilizando a senha e o IV também passados como parâmetros. Ela utiliza a função importKey para importar a senha, a função deriveKey para derivar a chave de criptografia a partir da senha e do IV, e a função decrypt para descriptografar os dados.
 *
 * verifyMessage(message, SEPARATOR): essa função verifica se a mensagem passada como parâmetro é válida. Para isso, ela verifica se a mensagem contém um separador (no caso, "--"), se o timestamp contido na mensagem é um número válido e se o timestamp está dentro da validade estipulada no cabeçalho.
 *
 * fromBase64(base64): essa função converte uma string codificada em Base64 para um vetor de bytes.
 *
 * validate(headers): essa função é a principal da classe e é responsável por validar a autorização da requisição. Ela utiliza as outras funções da classe para extrair os dados do cabeçalho, gerar o IV, descriptografar os dados e verificar se a mensagem é válida.
 *
 * const crypto = require("crypto");
 * Por Jonatan Villela -- jonatan.villela@gmail.com
*/
const crypto = require("crypto");

class AuthorizationValidator {
    constructor(ENCRYPTION_PASSWORD, HEADER_VALIDITY) {
        this.ENCRYPTION_PASSWORD = ENCRYPTION_PASSWORD;
        this.HEADER_VALIDITY = HEADER_VALIDITY;
      }

  async extractHeaders(req) {
    const { timestamp, jonatansec: encryptedData } = req.headers;
    return { timestamp, encryptedData };
  }

  async generateIV(timestamp) {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(timestamp)
    );
    return new Uint8Array(hashBuffer.slice(0, 16));
  }

  async decryptMessage(encryptedData, password, IV) {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(IV),
        iterations: 100000,
        hash: "SHA-512",
      },
      keyMaterial,
      { name: "AES-CTR", length: 256, counter: new Uint8Array(IV) },
      false,
      ["decrypt"]
    );

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-CTR", counter: new Uint8Array(IV), length: 128 },
      key,
      this.fromBase64(encryptedData)
    );

    return new TextDecoder().decode(decryptedData);
  }

  verifyMessage(message, SEPARATOR) {
    if (typeof message !== "string" || message.length === 0) {
      throw new Error("unauthorized");
    }

    if (!message.includes(SEPARATOR)) {
      throw new Error('unauthorized');
    }

    const [timestamp, _] = message.split(SEPARATOR);
    if (!/^\d+$/.test(timestamp)) {
      throw new Error("unauthorized");
    }

    const timestamp_check = parseInt(timestamp) + (this.HEADER_VALIDITY * 1000);
    const timestamp_current = new Date().getTime();

    if (timestamp_current > timestamp_check) {
      throw new Error("unauthorized");
    }

    return { timestamp_check };
  }

  fromBase64(base64) {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }

  async validate(headers) {
    const { timestamp, encryptedData } = headers;
    if (!encryptedData || !timestamp) {
      throw new Error("unauthorized");
    }
    const IV = await this.generateIV(timestamp);
    const decryptedData = await this.decryptMessage(
      encryptedData,
      this.ENCRYPTION_PASSWORD,
      IV
    );
    return this.verifyMessage(decryptedData, "--");
  }
}

module.exports = AuthorizationValidator;



