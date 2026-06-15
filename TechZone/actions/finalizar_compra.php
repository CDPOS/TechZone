<?php
// 1. Importa o arquivo de conexão com o banco de dados
require_once '../db/conexao.php';

// 2. Verifica se os dados foram enviados via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Captura os dados enviados pelo formulário e remove espaços em branco inúteis
    $nome     = isset($_POST['nome']) ? trim($_POST['nome']) : '';
    $email    = isset($_POST['email']) ? trim($_POST['email']) : '';
    $telefone = isset($_POST['telefone']) ? trim($_POST['telefone']) : '';
    $endereco = isset($_POST['endereco']) ? trim($_POST['endereco']) : '';
    $produtos = $_POST['produtos_comprados'] ?? '[]';
    $total    = $_POST['total_pago'] ?? 0;

    // VALIDAÇÃO: Verifica se algum campo obrigatório está vazio
    if (empty($nome) || empty($email) || empty($telefone) || empty($endereco) || $produtos === '[]' || $total <= 0) {
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error').then(() => {
                    window.history.back();
                });
            });
        </script>";
        exit;
    }

    // VALIDAÇÃO: Formato do E-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('E-mail Inválido!', 'O formato do e-mail é inválido.', 'warning').then(() => {
                    window.history.back();
                });
            });
        </script>";
        exit;
    }

    // VALIDAÇÃO: Verifica se o JSON é válido
    json_decode($produtos);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('Erro!', 'Os dados do carrinho estão corrompidos.', 'error').then(() => {
                    window.history.back();
                });
            });
        </script>";
        exit;
    }

    try {
        // 3. Prepara o comando SQL
        $sql = "INSERT INTO pedidos (nome_cliente, email, telefone, endereco, produtos_comprados, total_pago) 
                VALUES (:nome, :email, :telefone, :endereco, :produtos, :total)";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefone', $telefone);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':produtos', $produtos);
        $stmt->bindParam(':total', $total);

        // 4. Executa
        $stmt->execute();

        // Sucesso
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                localStorage.removeItem('carrinho');
                Swal.fire('Sucesso!', 'Pedido realizado com sucesso!', 'success').then(() => {
                    window.location.href = '../index.html';
                });
            });
        </script>";

    } catch (PDOException $e) {
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('Erro no Banco!', 'Não foi possível salvar: " . addslashes($e->getMessage()) . "', 'error').then(() => {
                    window.history.back();
                });
            });
        </script>";
    }
} else {
    // Se não for POST, redireciona
    header('Location: ../carrinho.php');
    exit;
}
?>