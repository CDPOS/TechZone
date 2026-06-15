<?php
require_once '../db/conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados alterados do formulário
    $id = $_POST['id'] ?? '';
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefone = $_POST['telefone'] ?? '';
    $endereco = $_POST['endereco'] ?? '';

    if (empty($id) || empty($nome) || empty($email) || empty($telefone) || empty($endereco)) {
        echo "<script>alert('Campos inválidos.'); window.history.back();</script>";
        exit;
    }

    try {
        // Comando SQL para ATUALIZAR as informações do pedido correto
        $sql = "UPDATE pedidos SET nome_cliente = :nome, email = :email, telefone = :telefone, endereco = :endereco WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telefone', $telefone);
        $stmt->bindParam(':endereco', $endereco);
        
        $stmt->execute();

        // Alerta de sucesso e joga o usuário de volta pro painel de visualização
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('Atualizado!', 'Pedido atualizado com sucesso!', 'success').then(() => {
                    window.location.href = '../views/painel_pedidos.php';
                });
            });
        </script>";

    } catch (PDOException $e) {
        die("Erro ao atualizar o pedido: " . $e->getMessage());
    }
} else {
    header('Location: ../views/painel_pedidos.php');
    exit;
}
?>