<?php
require_once '../db/conexao.php';

// Pega o ID do pedido que veio pela URL
$id = $_GET['id'] ?? null;

if (!$id) {
    die("ID do pedido não foi fornecido.");
}

try {
    // Busca os dados desse pedido específico para preencher o formulário
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

    // Se não achar o pedido com esse ID, para aqui
    if (!$pedido) {
        die("Pedido não encontrado.");
    }
} catch (PDOException $e) {
    die("Erro ao buscar dados do pedido: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Pedido | TechZone</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body style="background-color: #0f172a; color: #e2e8f0; font-family: sans-serif;">

    <header>
        <h1>⚡ TechZone - Editar Pedido #<?php echo $pedido['id']; ?></h1>
        <nav>
            <a href="painel_pedidos.php">Voltar ao Painel</a>
        </nav>
    </header>

    <main style="max-width: 600px; margin: 40px auto; padding: 20px;">
        <div style="background: #1e293b; padding: 20px; border-radius: 8px;">
            <h2 style="color: #eab308; margin-bottom: 20px;">✏️ Alterar Dados do Pedido</h2>
            
            <!-- Esse formulário vai enviar as alterações para a pasta actions -->
            <form method="POST" action="../actions/editar_pedido.php">
                
                <!-- Campo invisível para sabermos QUAL pedido estamos atualizando -->
                <input type="hidden" name="id" value="<?php echo $pedido['id']; ?>">

                <div style="margin-bottom: 15px;">
                    <label style="display:block; color:#94a3b8; margin-bottom: 5px;">Nome do Cliente:</label>
                    <input type="text" name="nome" value="<?php echo htmlspecialchars($pedido['nome_cliente']); ?>" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; color:#94a3b8; margin-bottom: 5px;">E-mail:</label>
                    <input type="email" name="email" value="<?php echo htmlspecialchars($pedido['email']); ?>" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; color:#94a3b8; margin-bottom: 5px;">Telefone:</label>
                    <input type="text" name="telefone" value="<?php echo htmlspecialchars($pedido['telefone']); ?>" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display:block; color:#94a3b8; margin-bottom: 5px;">Endereço de Entrega:</label>
                    <textarea name="endereco" required rows="3" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;"><?php echo htmlspecialchars($pedido['endereco']); ?></textarea>
                </div>

                <button type="submit" style="width: 100%; padding: 12px; background: #eab308; color: black; font-weight: bold; font-size: 16px; border: none; border-radius: 4px; cursor: pointer;">Salvar Alterações</button>
            </form>
        </div>
    </main>

</body>
</html>