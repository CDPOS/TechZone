/* ==========================================================================
   1. BANCO DE DADOS DE PRODUTOS
   ========================================================================== */
const dadosProdutos = [
    { id: 'ram', nome: "Memória RAM Kingston Fury 8GB", preco: 199.90, img: "img/Memoria-RAM.webp", categoria: "hardware", desc: "DDR4 3200MHz Alta Performance para Games e Multitasking." },
    { id: 'processador', nome: "Processador AMD Ryzen 5 5500", preco: 899.90, img: "img/Processador.webp", categoria: "hardware", desc: "6 Núcleos e 12 Threads. Desempenho excepcional para jogos modernos." },
    { id: 'monitor', nome: "Monitor Gamer ASUS ROG Strix 27\"", preco: 2199.90, img: "img/Monitor.webp", categoria: "perifericos", desc: "Painel IPS, 180Hz de taxa de atualização e 1ms de resposta." },
    { id: 'cadeira', nome: "Cadeira Gamer Husky Storm", preco: 799.90, img: "img/Cadeira-Gamer.webp", categoria: "acessorios", desc: "Design ergonômico com ajuste de altura e inclinação premium." },
    { id: 'teclado', nome: "Teclado Gamer Redragon Kumara Pro", preco: 299.90, img: "img/Teclado-Gamer.webp", categoria: "perifericos", desc: "Mecânico, Switches de alta durabilidade e iluminação RGB customizável." },
    { id: 'mouse', nome: "Mouse Gamer Redragon Cobra", preco: 149.90, img: "img/Mouse-Gamer.webp", categoria: "perifericos", desc: "Sensor Pixart 3325, 10.000 DPI e botões programáveis via software." }
];

/* 2. CONTADOR VISUAL DO MENU */
function atualizarContadorVisual() {
    const contador = document.getElementById("contagem-carrinho");
    if (!contador) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    if (totalItens > 0) {
        contador.textContent = totalItens;
        contador.style.display = "inline-block";
    } else {
        contador.style.display = "none";
    }
}

/* 3. RENDERIZAÇÃO E FILTROS */

function renderizarProdutos(produtosParaExibir) {
    const vitrine = document.getElementById("vitrine-produtos");
    if (!vitrine) return;

    vitrine.innerHTML = ""; 
    produtosParaExibir.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
            <article class="card">
                <img src="${p.img}" alt="${p.nome}">
                <h3>${p.nome}</h3>
                <p class="preco">R$ ${p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <a href="especificacoes.html?produto=${p.id}" class="btn-detalhes">Ver detalhes</a>
                <button onclick="adicionarCarrinho('${p.id}')" class="btn-comprar" style="margin-top:10px">Adicionar ao Carrinho</button>
            </article>`;
        vitrine.appendChild(li);
    });
}

// FUNÇÃO MESTRE: Resolve o conflito entre Filtro e Ordenação
function aplicarFiltrosEOrdenacao() {
    const elementoFiltro = document.getElementById("filtro-categoria");
    const elementoOrdem = document.getElementById("ordenar-preco");
    
    if (!elementoFiltro) return;

    const categoriaSelecionada = elementoFiltro.value;
    // Pega o valor da ordem (se o elemento não existir na página atual, assume 'padrao')
    const ordemSelecionada = elementoOrdem ? elementoOrdem.value : 'padrao';

    // 1. Filtrar
    let listaResultado = categoriaSelecionada === "todos" 
        ? [...dadosProdutos] 
        : dadosProdutos.filter(p => p.categoria === categoriaSelecionada);

    // 2. Ordenar
    if (ordemSelecionada === "crescente") {
        listaResultado.sort((a, b) => a.preco - b.preco);
    } else if (ordemSelecionada === "decrescente") {
        listaResultado.sort((a, b) => b.preco - a.preco);
    }

    // 3. Mostrar na tela
    renderizarProdutos(listaResultado);

    // 4. Atualizar contador de busca
    const contador = document.getElementById("contador-produtos");
    if(contador) contador.textContent = `${listaResultado.length} produto(s) encontrado(s)`;
}

function filtrarProdutos() {
    aplicarFiltrosEOrdenacao();
}

function ordenarProdutosPagina() {
    aplicarFiltrosEOrdenacao();
}

function ordenarProdutos(ordem) {
    const elementoOrdem = document.getElementById("ordenar-preco");
    if (elementoOrdem) {
        elementoOrdem.value = ordem;
    }
    aplicarFiltrosEOrdenacao();
}

/* 4. LÓGICA DO CARRINHO */
function adicionarCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        if (itemExistente.quantidade < 10) {
            itemExistente.quantidade += 1;
        } else {
            Swal.fire({
                title: 'Ops!',
                text: 'Limite máximo de 10 unidades atingido.',
                icon: 'warning',
                confirmButtonColor: '#22c55e',
                background: '#0a0f1e',
                color: '#fff'
            });
            return;
        }
    } else {
        carrinho.push({ id: id, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    Swal.fire({
        title: 'Sucesso!',
        text: 'Produto adicionado ao carrinho!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#0a0f1e',
        color: '#fff',
        iconColor: '#22c55e'
    });

    atualizarContadorVisual();
    if (document.getElementById("lista-carrinho")) renderizarCarrinho();
}

function renderizarCarrinho() {
    const listaCarrinho = document.getElementById("lista-carrinho");
    if (!listaCarrinho) return;

    let itensNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    listaCarrinho.innerHTML = "";
    let totalGeral = 0;

    if (itensNoCarrinho.length === 0) {
        listaCarrinho.innerHTML = "<p style='padding: 20px; text-align: center; width: 100%;'>Seu carrinho está vazio.</p>";
        const totalElem = document.getElementById("total-carrinho");
        if(totalElem) totalElem.textContent = "Total: R$ 0,00";
        return;
    }

    itensNoCarrinho.forEach((item, index) => {
        const produto = dadosProdutos.find(p => p.id === item.id);
        if (produto) {
            const subtotal = produto.preco * item.quantidade;
            totalGeral += subtotal;

            let opcoesQtd = "";
            for (let i = 1; i <= 10; i++) {
                opcoesQtd += `<option value="${i}" ${item.quantidade == i ? 'selected' : ''}>${i}</option>`;
            }

            const li = document.createElement("li");
            li.className = "item-carrinho-lista"; 
            li.innerHTML = `
                <div class="info-item">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <div class="detalhes-texto">
                        <h4>${produto.nome}</h4>
                        <p>Unitário: R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div class="controles-item">
                    <div class="qtd-seletor">
                        <label>Qtd:</label>
                        <select onchange="alterarQuantidade(${index}, this.value)">
                            ${opcoesQtd}
                        </select>
                    </div>
                    <div class="subtotal-item">
                        <span>Subtotal</span>
                        <p>R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button onclick="excluirItemTotal(${index})" class="btn-lixeira">🗑️</button>
                </div>`;
            listaCarrinho.appendChild(li);
        }
    });

    const totalDisplay = document.getElementById("total-carrinho");
    if(totalDisplay) totalDisplay.textContent = `Total: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function alterarQuantidade(index, novaQtd) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho[index].quantidade = parseInt(novaQtd);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContadorVisual();
}

function excluirItemTotal(index) {
    Swal.fire({
        title: 'Remover item?',
        text: "O produto será retirado do seu carrinho.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
        background: '#0a0f1e',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
            carrinho.splice(index, 1);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarContadorVisual();
        }
    });
}

function limparCarrinho() {
    Swal.fire({
        title: 'Esvaziar carrinho?',
        text: "Todos os itens serão removidos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sim, esvaziar!',
        cancelButtonText: 'Cancelar',
        background: '#0a0f1e',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrinho");
            renderizarCarrinho();
            atualizarContadorVisual();
            Swal.fire({
                title: 'Limpo!',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
                background: '#0a0f1e',
                color: '#fff'
            });
        }
    });
}

/* 5. DETALHES E FORMULÁRIOS */
function carregarDetalhesProduto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("produto");
    const nomeElement = document.getElementById("nome");
    if (!id || !nomeElement) return;

    const item = dadosProdutos.find(p => p.id === id);
    if (item) {
        nomeElement.textContent = item.nome;
        document.getElementById("preco").textContent = `R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById("imagem").src = item.img;
        document.getElementById("descricao").textContent = item.desc;
        const btn = document.getElementById("btn-comprar-detalhe");
        if (btn) btn.onclick = () => adicionarCarrinho(item.id);
    }
}

function inicializarFormulario() {
    const form = document.getElementById("form-contato");
    if (!form) return;

    const fone = document.getElementById("telefone");
    const urgencia = document.getElementById("urgencia");
    const valorUrgencia = document.getElementById("valorUrgencia");
    const campoNascimento = document.getElementById("nascimento");

    if (campoNascimento) {
        const hoje = new Date();
        const dataLimite = new Date(hoje.getFullYear() - 10, hoje.getMonth(), hoje.getDate());
        campoNascimento.setAttribute("max", dataLimite.toISOString().split('T')[0]);
    }

    if (fone) {
        fone.addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !val[2] ? val[1] : '(' + val[1] + ') ' + val[2] + (val[3] ? '-' + val[3] : '');
        });
    }

    if (urgencia) {
        const atualizarBarra = () => {
            const min = urgencia.min || 1;
            const max = urgencia.max || 5;
            const val = urgencia.value;
            const porcentagem = (val - min) * 100 / (max - min);
            urgencia.style.backgroundSize = porcentagem + '% 100%';
            if(valorUrgencia) valorUrgencia.textContent = val;
        };
        urgencia.addEventListener("input", atualizarBarra);
        atualizarBarra();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const dataSelecionada = new Date(campoNascimento.value);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataSelecionada.getFullYear();
        const m = hoje.getMonth() - dataSelecionada.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataSelecionada.getDate())) {
            idade--;
        }

        if (idade < 10) {
            Swal.fire({
                title: 'Idade insuficiente',
                text: 'A TechZone é permitida apenas para maiores de 10 anos.',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                background: '#0a0f1e',
                color: '#fff'
            });
            return;
        }

        Swal.fire({
            title: 'Enviado!',
            text: 'Obrigado! Recebemos sua mensagem.',
            icon: 'success',
            confirmButtonColor: '#22c55e',
            background: '#0a0f1e',
            color: '#fff'
        });

        form.reset();
        if(valorUrgencia) valorUrgencia.textContent = "3";
        const event = new Event('input');
        if(urgencia) urgencia.dispatchEvent(event);
    });
}

/* 6. INICIALIZAÇÃO ÚNICA*/
document.addEventListener("DOMContentLoaded", () => {
    // Inicializa a vitrine respeitando filtros se houver select na página
    if (document.getElementById("vitrine-produtos")) {
        aplicarFiltrosEOrdenacao();
    }
    carregarDetalhesProduto();
    inicializarFormulario();
    if (document.getElementById("lista-carrinho")) renderizarCarrinho();
    atualizarContadorVisual();
});