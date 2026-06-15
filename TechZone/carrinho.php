<!DOCTYPE html>

<html lang="pt-br">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Meu Carrinho | TechZone</title>

    <link rel="stylesheet" href="css/estilos.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</head>

<body>

    <header>

        <h1>⚡ TechZone</h1>

        <nav>

            <a href="index.html">Home</a>

            <a href="produtos.html">Produtos</a>

            <a href="contato.html">Contato</a>

            <a href="carrinho.php" class="nav-carrinho">

                🛒 Carrinho 

                <span id="contagem-carrinho" style="background: #ef4444; color: white; border-radius: 50%; padding: 2px 7px; font-size: 11px; margin-left: 5px; display: none;">0</span>

            </a>

        </nav>

    </header>



    <main class="container-produtos">

        <h2 class="titulo-sessao">🛒 Itens no seu Carrinho</h2>

        

        <ul id="lista-carrinho"></ul>



        <div class="total-secao">

            <h3 id="total-carrinho">Total: R$ 0,00</h3>

            <div class="acoes-carrinho">

                <button onclick="limparCarrinho()" class="btn-esvaziar">Esvaziar Carrinho</button>

            </div>

        </div>



        <div class="formulario-entrega" style="margin-top: 30px; background: #1e293b; padding: 20px; border-radius: 8px;">

            <h3 style="color: #e2e8f0; margin-bottom: 15px;">📍 Dados de Entrega e Pagamento</h3>

            

            <form id="form-checkout" method="POST" action="actions/finalizar_compra.php">

                

                <div style="margin-bottom: 10px;">

                    <label style="display:block; color:#94a3b8;">Nome Completo:</label>

                    <input type="text" name="nome" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">

                </div>



                <div style="margin-bottom: 10px;">

                    <label style="display:block; color:#94a3b8;">E-mail:</label>

                    <input type="email" name="email" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">

                </div>



                <div style="margin-bottom: 10px;">

                    <label style="display:block; color:#94a3b8;">Telefone:</label>

                    <input type="text" name="telefone" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;">

                </div>



                <div style="margin-bottom: 15px;">

                    <label style="display:block; color:#94a3b8;">Endereço de Entrega Completo:</label>

                    <textarea name="endereco" required rows="3" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white;"></textarea>

                </div>



                <input type="hidden" id="input-produtos" name="produtos_comprados">

                <input type="hidden" id="input-total" name="total_pago">



                <button type="submit" class="btn-comprar" style="width: 100%; padding: 12px; font-size: 16px;">Finalizar Compra</button>

            </form>

        </div>

        </main>



    <footer>

        <p>© 2026 - TechZone - Cauã Santos</p>

        <p>Dúvidas? <a href="mailto:contato@techzone.com" style="color: #22c55e;">contato@techzone.com</a></p>

    </footer>



    <script src="js/app.js"></script>

    

    <script>

        document.getElementById('form-checkout').addEventListener('submit', function(e) {

            

            const itensCarrinho = localStorage.getItem('carrinho') || '[]';

            

            

            const textoTotal = document.getElementById('total-carrinho').innerText;

            const valorLimpo = textoTotal.replace('Total: R$ ', '').replace('.', '').replace(',', '.').trim();



            if (itensCarrinho === '[]' || parseFloat(valorLimpo) <= 0) {

                e.preventDefault(); 

                Swal.fire('Oops!', 'Seu carrinho está vazio!', 'warning');

                return;

            }



            

            document.getElementById('input-produtos').value = itensCarrinho;

            document.getElementById('input-total').value = parseFloat(valorLimpo);

        });

    </script>

</body>

</html>