<?php
require_once '../db/conexao.php';

// Pega o ID do pedido enviado via URL pela função confirmarExclusao
$id = $_GET['id'] ?? null;

if ($id) {
    try {
        // Comando para DELETAR o pedido com o ID selecionado
        $sql = "DELETE FROM pedidos WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Alerta avisando que deu certo e voltando para a lista
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire('Excluído!', 'O pedido foi deletado com sucesso.', 'success').then(() => {
                    window.location.href = '../views/painel_pedidos.php';
                });
            });
        </script>";

    } catch (PDOException $e) {
        die("Erro ao excluir o pedido: " . $e->getMessage());
    }
} else {
    header('Location: ../views/painel_pedidos.php');
    exit;
}
?>