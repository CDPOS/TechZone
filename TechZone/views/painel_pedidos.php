<?php
// Importa a conexão com o banco de dados.
require_once '../db/conexao.php';

try {
    // Busca todos os pedidos do banco de dados, ordenando pelos mais recentes
    $stmt = $pdo->query("SELECT * FROM pedidos ORDER BY data_pedido DESC");
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Erro ao buscar pedidos: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Pedidos | TechZone</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body style="background-color: #0f172a; color: #e2e8f0; font-family: sans-serif;">

    <header>
        <h1>⚡ TechZone - Painel Admin</h1>
        <nav>
            <a href="../index.html">Voltar para o Site</a>
        </nav>
    </header>

    <main style="max-width: 1300px; margin: 40px auto; padding: 20px;">
        <h2 style="color: #22c55e; margin-bottom: 20px;">📦 Gerenciamento de Pedidos</h2>

        <?php if (empty($pedidos)): ?>
            <p>Nenhum pedido encontrado no banco de dados.</p>
        <?php else: ?>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: #334155; text-align: left;">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px;">Cliente</th>
                            <th style="padding: 12px;">Contato</th>
                            <th style="padding: 12px;">Produtos Comprados</th>
                            <th style="padding: 12px;">Endereço</th>
                            <th style="padding: 12px;">Total</th>
                            <th style="padding: 12px;">Data</th>
                            <th style="padding: 12px; text-align: center;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pedidos as $pedido): ?>
                            <tr style="border-bottom: 1px solid #475569;">
                                <td style="padding: 12px;"><?php echo $pedido['id']; ?></td>
                                <td style="padding: 12px;"><strong><?php echo htmlspecialchars($pedido['nome_cliente']); ?></strong></td>
                                <td style="padding: 12px;">
                                    <?php echo htmlspecialchars($pedido['email']); ?><br>
                                    <small style="color: #94a3b8;"><?php echo htmlspecialchars($pedido['telefone']); ?></small>
                                </td>
                                 
                                <td style="padding: 12px; font-size: 14px;">
                                    <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
                                        <?php 
                                        // Transforma o texto JSON do banco em uma lista do PHP
                                        $itens = json_decode($pedido['produtos_comprados'], true);
                                         
                                        if (is_array($itens)) {
                                            foreach ($itens as $item) {
                                                $nomeProduto = $item['titulo'] ?? $item['nome'] ?? 'Produto';
                                                $qtdProduto = $item['quantidade'] ?? $item['qtd'] ?? 1;
                                                 
                                                echo "<li>{$qtdProduto}x " . htmlspecialchars($nomeProduto) . "</li>";
                                            }
                                        } else {
                                            echo "<span style='color: #94a3b8;'>Erro ao ler produtos</span>";
                                        }
                                        ?>
                                    </ul>
                                </td>

                                <td style="padding: 12px; max-width: 200px; font-size: 14px;">
                                    <?php echo htmlspecialchars($pedido['endereco']); ?>
                                </td>
                                <td style="padding: 12px; color: #22c55e; font-weight: bold;">
                                    R$ <?php echo number_format($pedido['total_pago'], 2, ',', '.'); ?>
                                </td>
                                <td style="padding: 12px; font-size: 13px;">
                                    <?php echo date('d/m/Y H:i', strtotime($pedido['data_pedido'])); ?>
                                </td>
                                <td style="padding: 12px; text-align: center;">
                                    <a href="editar_form.php?id=<?php echo $pedido['id']; ?>" style="background: #eab308; color: black; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; margin-right: 5px; font-weight: bold;">Editar</a>
                                    <button onclick="confirmarExclusao(<?php echo $pedido['id']; ?>)" style="background: #ef4444; color: white; padding: 6px 12px; border-radius: 4px; border: none; font-size: 13px; cursor: pointer; font-weight: bold;">Excluir</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </main>

    <script>
        function confirmarExclusao(id) {
            Swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá reverter esta ação!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#475569',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../actions/excluir_pedido.php?id=' + id;
                }
            })
        }
    </script>
</body>
</html>