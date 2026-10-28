# Changelog

## [Não publicado]

## [0.14.16] / 2026-10-28

### Segurança

- Atualizado `node-forge` de `1.4.0` para `1.4.2`, corrigindo 17 advisories (8 *high*) — entre eles os que atingem a conversão PKCS#12 → PEM em `src/util/certificado.js`: forjamento do MAC do PKCS#12 por falta de checagem do número de iterações, esgotamento de recursos ao decodificar BIT STRING no ASN.1 e ReDoS na decodificação de PEM. A `1.4.2` corrige a regressão da `1.4.1` no `pem.decode()` com entrada `Buffer`
- Atualizado `xml-crypto` de `6.1.2` para `6.4.0`, com correções de canonicalização (namespaces, instruções de processamento, escape de valores) e de verificação de assinaturas. A assinatura de eventos em `src/util/assinatura.js` não mudou e a saída foi verificada byte-a-byte idêntica à da versão anterior
- Atualizado `axios` de `1.20.0` para `1.21.0`. A única mudança incompatível (objetos de classe usados como `headers` padrão) não afeta `src/services/sefaz-service.js`, que usa um objeto literal
- Atualizado `fast-xml-parser` de `5.11.1` para `5.11.2` (decodificação de entrada `Uint8Array` como UTF-8). JSON de resposta e XML de requisição verificados byte-a-byte idênticos
- `npm audit`: 0 vulnerabilidades

## [0.14.15] / 2026-09-05

### Segurança

- Atualizado `xml-crypto` de `2.1.6` para `6.1.2`, corrigindo os advisories *high* do `@xmldom/xmldom` (`<=0.8.12`) que vinham por dependência transitiva. A assinatura de eventos em `src/util/assinatura.js` foi migrada para a nova API mantendo o mesmo perfil de algoritmos (RSA-SHA1 / SHA1 / C14N) — saída verificada byte-a-byte idêntica à da versão anterior. Removido `@types/xml-crypto` (o `xml-crypto` v6 já inclui os próprios tipos)
- Atualizado `axios` de `1.8.3` para `1.20.0`, corrigindo 29 advisories (*high*) da série 1.x — SSRF por bypass de `NO_PROXY`, vazamento de `Proxy-Authorization` em redirecionamentos, DoS e gadgets de *prototype pollution*. O uso em `src/services/sefaz-service.js` (`axios.create` com `httpsAgent`, `baseURL` e `timeout`) não mudou e os padrões de `maxContentLength`/`maxBodyLength` seguem ilimitados
- Atualizado `node-forge` de `1.3.1` para `1.4.0`, corrigindo 7 advisories (*high*) — recursão ilimitada e dessincronização do validador ASN.1, truncamento de OID, bypass de `basicConstraints` e forjamento de assinaturas RSA-PKCS/Ed25519. A conversão PKCS#12 → PEM em `src/util/certificado.js` foi verificada com PFX moderno (AES/PBKDF2/SHA-256), legado (RC2-40/3DES/SHA-1, formato típico das exportações ICP-Brasil) e sem MAC — saída byte-a-byte idêntica à da versão anterior
- Atualizado `fast-xml-parser` de `4.5.3` para `5.11.1`, corrigindo 6 advisories (1 *critical*) — expansão de entidades em DOCTYPE sem limite, bypass por entidades numéricas, *stack overflow* no `XMLBuilder` e injeção de comentário/CDATA. As opções do `XMLParser`/`XMLBuilder` em `src/util/xml.js` mantêm o mesmo comportamento na v5: XML de requisição, JSON de resposta, `docZip` descompactado e assinatura verificados byte-a-byte idênticos. Adicionado `test/helpers.test.js` com testes *golden* de `montarResponse` (cStat 138/137/135/573, `docZip` único e múltiplo, sentinela `<error>`)
- Atualizado `mocha` (devDependency) de `^10.8.2` para `^12.0.0`, removendo o `serialize-javascript` vulnerável (RCE e DoS). A suíte de testes passa a exigir Node `^20.19.0 || >=22.12.0`
- `npm audit`: 0 vulnerabilidades

### Modificado

- Os artefatos de build `lib/` e `dist/` (entry points `main` e `types` do `package.json`) passam a ser versionados no repositório, pois o pacote é consumido como tarball do GitHub e o npm não executa o build nesse caso. Removidos `lib` e `dist` do `.gitignore`

## [0.14.13] / 2025-04-23

- Node lançando erro `TypeError: Cannot add property rejectUnauthorized, object is not extensible` #22

## [0.14.12] / 2025-04-17

- Ambiente de Produção retornando `unable to get local issuer certificate`

## [0.14.11] / 2025-03-18

### Segurança

- Atualizado as dependências npm

## [0.14.10] / 2024-10-24

### Segurança

- Atualizado as dependências npm

## [0.14.9] / 2024-05-08

### Segurança

- Atualizado as dependências npm

## [0.14.8] / 2024-01-15

### Segurança

- Atualizado as dependências npm

## [0.14.7] / 2023-10-30

### Segurança

- Atualizado as dependências npm

## [0.14.6] / 2023-09-19

### Segurança

- Atualizado as dependências npm

## [0.14.5] / 2023-07-28

### Corrigido

- Arquivo `.pfx` com lista de certificados invertida

## [0.14.4] / 2023-07-19

### Modificado

- Atualizado README.md

### Segurança

- Atualizado as dependências npm

## [0.14.3] / 2023-06-08

### Segurança

- Atualizado as dependências npm

## [0.14.2] / 2023-04-17

### Segurança

- Atualizado as dependências npm

## [0.14.1] / 2023-02-21

### Segurança

- Atualizado as dependências npm

## [0.14.0] / 2023-01-14

### Adicionado

- Testes Unitários #8

### Modificado

- Estruturação do código para ser possível testar cada módulo separadamente

### Segurança

- Atualizado as dependências npm

## [0.13.0] / 2022-11-29

### Modificado

- Biblioteca para lidar com datas e horas #7

## [0.12.0] / 2022-11-24

### Corrigido

- Método `consultaNSU` #4

### Segurança

- Atualizado as dependências npm

## [0.11.0] / 2022-08-20

### Adicionado

- Suporte para CPF nos serviços de `DistribuicaoDFe` e `RecepcaoEvento` #2
- Suporte para o tipo Buffer nas propriedades `cert` e `key` #3

### Corrigido

- Types

## [0.10.1] / 2022-08-15

### Adicionado

- ISSUE_TEMPLATE
- CODE_OF_CONDUCT.md
- CONTRIBUTING.md

### Corrigido

- Imutabilidade
- Types

### Modificado

- .npmignore

## [0.10.0] / 2022-08-11

### Adicionado

- Imutabilidade aos serviços de `DistribuicaoDFe` e `RecepcaoEvento`

### Corrigido

- Types

### Modificado

- Os métodos `consultaUltNSU`, `consultaChNFe`, `consultaNSU` e `enviarEvento` agora são funções puras e não alteram mais o objeto construído

## [0.9.2] / 2022-06-24

### Corrigido

- Types

## [0.9.1] / 2022-06-21

### Corrigido

- Campos faltantes no retorno do serviço de RecepcaoEvento
- Types

## [0.9.0] / 2022-06-21

### Corrigido

- Assinatura XML
- Types

### Modificado

- O retorno dos serviços de DistribuicaoDFe e RecepcaoEvento

## [0.8.0] / 2022-06-14

### Adicionado

- VS Code settings e prettier.config.js

### Corrigido

- Types
- Palavra-chave

### Modificado

- O serviço de RecepcaoEvento foi modificado para aceitar um lote de eventos, agora deve ser enviado uma lista de eventos para a função enviarEvento, e o retorno será uma lista dos eventos processados

## [0.7.3] / 2022-06-10

### Corrigido

- Montagem do Esquema XML de RecepcaoEvento

## [0.7.2] / 2022-06-10

### Corrigido

- Script para build do código

### Modificado

- A chave NFe não é mais passada no construtor do serviço de RecepcaoEvento, agora ela deve ser enviada na função de enviarEvento junto com o tipoEvento e justificativa
- URL do Web Service de Recepção Evento do Ambiente de produção

## [0.7.1] / 2022-06-09

### Modificado

- Simplificado o nome das funções de consulta do serviço de DistribuicaoDFe
  - consultaPorUltNSU => consultaUltNSU
  - consultaPorChaveNFe => consultaChNFe
  - consultaPorNSU => consultaNSU

### Segurança

- Atualizado as dependências npm

## [0.7.0] / 2022-06-09

### Adicionado

- Cadeia de Certificados da NF-e (www1.nfe.fazenda.gov.br)
- Suporte SOAP 1.2

### Corrigido

- Script para build do código

### Modificado

- URL do Web Service de Recepção Evento do Ambiente de homologação conforme publicado no informe dia 20/05/2022

### Removido

- Suporte SOAP 1.1

## [0.6.0] / 2022-04-28

### Modificado

- Biblioteca para geração de XML

## [0.5.0] / 2022-04-28

### Corrigido

- Script para build do código
- Retorno da Sefaz
- Types

### Modificado

- Consulta por último NSU

## [0.4.1] / 2022-04-25

### Corrigido

- Types

## [0.4.0] / 2022-04-25

### Adicionado

- Script para minificação do código
- Script para build do código (Gera os types e o código minificado)
- .npmignore

### Corrigido

- Palavra-chave

### Removido

- Types do repositório Git
- src do repositório NPM
- tsconfig.json do repositório NPM

## [0.3.0] / 2022-04-22

### Adicionado

- Descrição e Palavra-chave
- README.md Resumido

## [0.2.2] / 2022-04-22

### Corrigido

- Types

## [0.2.1] / 2022-04-22

### Corrigido

- Types

## [0.2.0] / 2022-04-22

### Adicionado

- Types

### Corrigido

- Otimizado código de comunicação com o Web Service

## [0.1.0] / 2022-04-20

### Adicionado

- Comunicação com o Web Service de NFeDistribuicaoDFe (Nota Técnica 2014.002 - v.1.12)
  - Processamento da Requisição de Distribuição de Conjunto de DF-e a Partir do NSU Informado (distNSU)
  - Processamento da Requisição de Consulta DF-e Vinculado ao NSU Informado (consNSU)
  - Processamento da Requisição de Consulta de NF-e por Chave de Acesso Informada (consChNFe)
- Comunicação com o Web Service de NFeRecepcaoEvento4 (Nota Técnica 2020.001 v.1.20)
  - 210200 - Confirmação da Operação
  - 210210 - Ciência da Operação
  - 210220 - Desconhecimento da Operação
  - 210240 - Operação não Realizada

[não publicado]: https://github.com/lucashpmelo/node-mde/compare/0.14.15..HEAD
[0.14.15]: https://github.com/lucashpmelo/node-mde/compare/0.14.13...0.14.15
[0.14.13]: https://github.com/lucashpmelo/node-mde/compare/0.14.12...0.14.13
[0.14.12]: https://github.com/lucashpmelo/node-mde/compare/0.14.11...0.14.12
[0.14.11]: https://github.com/lucashpmelo/node-mde/compare/0.14.10...0.14.11
[0.14.10]: https://github.com/lucashpmelo/node-mde/compare/0.14.9...0.14.10
[0.14.9]: https://github.com/lucashpmelo/node-mde/compare/0.14.8...0.14.9
[0.14.8]: https://github.com/lucashpmelo/node-mde/compare/0.14.7...0.14.8
[0.14.7]: https://github.com/lucashpmelo/node-mde/compare/0.14.6...0.14.7
[0.14.6]: https://github.com/lucashpmelo/node-mde/compare/0.14.5...0.14.6
[0.14.5]: https://github.com/lucashpmelo/node-mde/compare/0.14.4...0.14.5
[0.14.4]: https://github.com/lucashpmelo/node-mde/compare/0.14.3...0.14.4
[0.14.3]: https://github.com/lucashpmelo/node-mde/compare/0.14.2...0.14.3
[0.14.2]: https://github.com/lucashpmelo/node-mde/compare/0.14.1...0.14.2
[0.14.1]: https://github.com/lucashpmelo/node-mde/compare/0.14.0...0.14.1
[0.14.0]: https://github.com/lucashpmelo/node-mde/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/lucashpmelo/node-mde/compare/0.12.0...0.13.0
[0.12.0]: https://github.com/lucashpmelo/node-mde/compare/0.11.0...0.12.0
[0.11.0]: https://github.com/lucashpmelo/node-mde/compare/0.10.1...0.11.0
[0.10.1]: https://github.com/lucashpmelo/node-mde/compare/0.10.0...0.10.1
[0.10.0]: https://github.com/lucashpmelo/node-mde/compare/0.9.2...0.10.0
[0.9.2]: https://github.com/lucashpmelo/node-mde/compare/0.9.1...0.9.2
[0.9.1]: https://github.com/lucashpmelo/node-mde/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/lucashpmelo/node-mde/compare/0.8.0...0.9.0
[0.8.0]: https://github.com/lucashpmelo/node-mde/compare/0.7.3...0.8.0
[0.7.3]: https://github.com/lucashpmelo/node-mde/compare/0.7.2...0.7.3
[0.7.2]: https://github.com/lucashpmelo/node-mde/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/lucashpmelo/node-mde/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/lucashpmelo/node-mde/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/lucashpmelo/node-mde/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/lucashpmelo/node-mde/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/lucashpmelo/node-mde/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/lucashpmelo/node-mde/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/lucashpmelo/node-mde/compare/0.2.2...0.3.0
[0.2.2]: https://github.com/lucashpmelo/node-mde/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/lucashpmelo/node-mde/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/lucashpmelo/node-mde/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/lucashpmelo/node-mde/releases/tag/0.1.0
