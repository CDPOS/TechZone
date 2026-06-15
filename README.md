# ⚡ TechZone - Hardware & Periféricos Gamer

🚀 Repositório GitHub: [https://github.com/CDPOS/TechZone]

Este projeto é uma plataforma de e-commerce completa e responsiva, focada em componentes de alta performance e periféricos gamer. Originalmente desenvolvido no ecossistema de front-end, o sistema foi evoluído na **Etapa 3** com uma arquitetura back-end robusta em **PHP** integrada a um banco de dados **MySQL**, implementando um ciclo de vida **CRUD completo** para gerenciamento de pedidos.

## 🎯 Público-Alvo
- **Gamers & Streamers:** Que buscam o que há de mais moderno em processamento e periféricos RGB.
- **Entusiastas de Hardware:** Que valorizam especificações técnicas e comparação de preços.
- **Profissionais de Tecnologia:** Que buscam ergonomia e performance para o setup de trabalho.

## 🗺️ Mapa de Páginas e Fluxo do Sistema
O ecossistema do projeto é composto por páginas interconectadas divididas estrategicamente entre o escopo público do cliente e o ambiente restrito do administrador:

### Ambiente do Cliente (Front-end & Finalização)
- **Home (index.html):** Banner promocional, vitrine de destaques e ordenação rápida de preços. Contém o portal de autenticação simulado para a gerência.
- **Produtos (produtos.html):** Catálogo completo com sistema de filtro por categoria e ordenação síncrona.
- **Carrinho (carrinho.php):** Listagem de itens via LocalStorage, controle de quantidade (limite de 10 unidades) e formulário integrado de checkout.
- **Contato (contato.html):** Formulário de atendimento com máscara de telefone, trava de idade mínima (10 anos) e seletor de urgência.
- **Especificações (especificacoes.html):** Visualização detalhada e dinâmica de cada produto baseada em banco de dados JS.

### Ambiente Administrativo (Back-end & Painel)
- **Painel de Pedidos (views/painel_pedidos.php):** Área restrita que lista em tempo real todos os pedidos salvos no banco de dados, com decodificação do JSON de produtos comprados, formatação de valores em PT-BR e links de ação.
- **Editar Pedido (views/editar_form.php):** Formulário dinâmico que recupera os dados atuais do pedido via parâmetro GET para permitir modificações pelo administrador.

## 🛠️ Tecnologias e Recursos Utilizados
- **HTML5 Semântico:** Uso rigoroso de tags estruturais para SEO e acessibilidade.
- **CSS3 Moderno:** Layout totalmente responsivo utilizando CSS Grid e Flexbox, mantendo o visual "Dark Theme".
- **JavaScript (Client-Side):** Persistência do carrinho, lógica de filtragem cruzada, máscaras de inputs e manipulação de modais com SweetAlert2.
- **PHP 7+ (Server-Side):** Arquitetura estruturada para o processamento de formulários via requisições POST, segurança contra injeção de dados e gerenciamento de fluxo.
- **PDO (PHP Data Objects):** Camada segura de abstração de dados utilizando Prepared Statements para blindar a aplicação contra ataques de SQL Injection.
- **MySQL / MariaDB:** Banco de dados relacional para persistência permanente das informações de vendas.

## 🚀 Funcionalidades de Destaque da Etapa 3 (CRUD)
- **Barreira de Autenticação Restrita:** Para mitigar riscos e simular o controle de acessos de um sistema real, o link "⚙️ Admin" na barra de navegação da Home intercepta a requisição via JavaScript e exige credenciais administrativas via caixa de diálogo protegida do SweetAlert2.
- **Create (Cadastro de Pedido):** Ao preencher o checkout no carrinho, o script /actions/finalizar_compra.php recebe as variáveis via POST, valida a integridade dos dados e salva o registro no banco, limpando o LocalStorage logo em seguida.
- **Read (Listagem Dinâmica):** O painel administrativo consome os dados do banco por meio de uma query ordenada (ORDER BY data_pedido DESC) e reconverte a string de texto estruturada em formato JSON de volta para uma lista PHP legível de produtos.
- **Update (Edição Segura):** O arquivo /actions/editar_pedido.php atualiza dados como nome, e-mail, telefone e endereço do cliente utilizando parâmetros nomeados e vinculados (bindParam).
- **Delete (Remoção com Confirmação):** A exclusão dispara um modal do SweetAlert2 solicitando a confirmação do usuário antes de redirecionar para o script /actions/excluir_pedido.php, garantindo que registros não sejam apagados por acidente.

## 🔑 Credenciais de Acesso Administrativo
Para fins de auditoria e avaliação da banca examinadora, o acesso ao painel gerencial na página inicial está protegido pela chave de teste local:
- **Senha do Administrador:** `admin123`

## ⚙️ Instruções de Instalação e Configuração Local

### 1. Preparando o Banco de Dados
1. Certifique-se de que o seu servidor local (ex: XAMPP, WAMP) esteja ativo com os módulos Apache e MySQL iniciados.
2. Acesse o phpMyAdmin (http://localhost/phpmyadmin/).
3. Crie um novo banco de dados com o nome exato de techzone e codificação utf8mb4_general_ci.
4. Execute o script contido no arquivo Banco.sql ou utilize a estrutura abaixo para criar a tabela de persistência:

CREATE DATABASE IF NOT EXISTS techzone DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE techzone;

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_cliente VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL,
    produtos_comprados TEXT NOT NULL,
    total_pago DECIMAL(10, 2) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### 2. Configurando as Credenciais Locais
Abra o arquivo localizado em /db/conexao.php e certifique-se de que os parâmetros batem com as configurações da sua máquina local:
$host = 'localhost';
$db_name = 'techzone';
$username = 'root'; // Usuário padrão do XAMPP
$password = '';     // Senha padrão vazia no XAMPP

### 3. Passos de Teste
1. Coloque a pasta do projeto dentro do diretório raiz do seu servidor (ex: C:\xampp\htdocs\TechZone).
2. Abra o navegador e digite a URL: http://localhost/TechZone/index.html
3. Adicione produtos na vitrine, vá para o Carrinho, preencha o formulário e finalize a compra.
4. No menu superior ou no rodapé da página inicial, clique em "⚙️ Admin", digite a senha `admin123` e pressione Entrar para acessar o painel de gerenciamento (CRUD).

## 📁 Estrutura Arquitetural do Código
- /actions: Scripts de processamento (finalizar_compra.php, editar_pedido.php, excluir_pedido.php)
- /db: Arquivo de conexão com o banco de dados (conexao.php)
- /views: Páginas administrativas e interfaces (painel_pedidos.php, editar_form.php)
- /css & /js: Arquivos centrais de estilização e inteligência front-end

---
**Desenvolvido por:** Cauã Douglas Pereira de Oliveira Santos  
🆔 **Matrícula:** 202508185148  
🎓 **Curso:** Ciências da Computação  
📅 **Data de Entrega:** Junho de 2026
