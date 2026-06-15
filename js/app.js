/* BANCO DE DADOS */
const dadosProdutos = [
    { id: 'ram', nome: "Memória RAM Kingston Fury 8GB", preco: 199.90, img: "img/Memoria-RAM.webp", categoria: "hardware", desc: "DDR4 3200MHz Alta Performance para Games e Multitasking." },
    { id: 'processador', nome: "Processador AMD Ryzen 5 5500", preco: 899.90, img: "img/Processador.webp", categoria: "hardware", desc: "6 Núcleos e 12 Threads. Desempenho excepcional para jogos modernos." },
    { id: 'monitor', nome: "Monitor Gamer ASUS ROG Strix 27\"", preco: 2199.90, img: "img/Monitor.webp", categoria: "perifericos", desc: "Painel IPS, 180Hz de taxa de atualização e 1ms de resposta." },
    { id: 'cadeira', nome: "Cadeira Gamer Husky Storm", preco: 799.90, img: "img/Cadeira-Gamer.webp", categoria: "acessorios", desc: "Design ergonômico com ajuste de altura e inclinação premium." },
    { id: 'teclado', nome: "Teclado Gamer Redragon Kumara Pro", preco: 299.90, img: "img/Teclado-Gamer.webp", categoria: "perifericos", desc: "Mecânico, Switches de alta durabilidade e iluminação RGB customizável." },
    { id: 'mouse', nome: "Mouse Gamer Redragon Cobra", preco: 149.90, img: "img/Mouse-Gamer.webp", categoria: "perifericos", desc: "Sensor Pixart 3325, 10.000 DPI e botões programáveis via software." }
];

/* CONTADOR */
function atualizarContadorVisual() {
    const contador = document.getElementById("contagem-carrinho");
    if (!contador) return;
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contador.textContent = totalItens;
    contador.style.display = totalItens > 0 ? "inline-block" : "none";
}

/* FILTROS E RENDERIZAÇÃO */
function aplicarFiltrosEOrdenacao() {
    const elFiltro = document.getElementById("filtro-categoria");
    const elOrdem = document.getElementById("ordenar-preco");
    if (!elFiltro) return;

    const cat = elFiltro.value;
    const ordem = elOrdem ? elOrdem.value : 'padrao';

    let resultado = cat === "todos" ? [...dadosProdutos] : dadosProdutos.filter(p => p.categoria === cat);

    if (ordem === "crescente") resultado.sort((a, b) => a.preco - b.preco);
    if (ordem === "decrescente") resultado.sort((a, b) => b.preco - a.preco);

    renderizarProdutos(resultado);
    const cont = document.getElementById("contador-produtos");
    if(cont) cont.textContent = `${resultado.length} produto(s) encontrado(s)`;
}

function renderizarProdutos(lista) {
    const vitrine = document.getElementById("vitrine-produtos");
    if (!vitrine) return;
    vitrine.innerHTML = ""; 
    lista.forEach(p => {
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

/* FUNÇÕES DE CHAMADA (SELECTS) */
function filtrarProdutos() { aplicarFiltrosEOrdenacao(); }
function ordenarProdutosPagina() { aplicarFiltrosEOrdenacao(); }
function ordenarProdutos(ordem) {
    const elOrdem = document.getElementById("ordenar-preco");
    if (elOrdem) elOrdem.value = ordem;
    aplicarFiltrosEOrdenacao();
}

/* CARRINHO */
function adicionarCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const item = carrinho.find(i => i.id === id);
    if (item) {
        if (item.quantidade < 10) item.quantidade++;
        else { Swal.fire({ title: 'Ops!', text: 'Limite de 10 unidades atingido.', icon: 'warning', background: '#0a0f1e', color: '#fff' }); return; }
    } else { carrinho.push({ id, quantidade: 1 }); }
    
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    Swal.fire({ title: 'Sucesso!', text: 'Produto adicionado!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0a0f1e', color: '#fff', iconColor: '#22c55e' });
    atualizarContadorVisual();
    if (document.getElementById("lista-carrinho")) renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    if (!lista) return;
    let itens = JSON.parse(localStorage.getItem("carrinho")) || [];
    lista.innerHTML = "";
    let total = 0;

    if (itens.length === 0) {
        lista.innerHTML = "<p style='padding: 20px; text-align: center; width: 100%;'>Seu carrinho está vazio.</p>";
        if(document.getElementById("total-carrinho")) document.getElementById("total-carrinho").textContent = "Total: R$ 0,00";
        return;
    }

    itens.forEach((item, index) => {
        const p = dadosProdutos.find(prod => prod.id === item.id);
        if (p) {
            const sub = p.preco * item.quantidade;
            total += sub;
            const li = document.createElement("li");
            li.className = "item-carrinho-lista"; 
            li.innerHTML = `
                <div class="info-item">
                    <img src="${p.img}">
                    <div><h4>${p.nome}</h4><p>R$ ${p.preco.toLocaleString('pt-BR')}</p></div>
                </div>
                <div class="controles-item">
                    <select onchange="alterarQuantidade(${index}, this.value)">
                        ${[...Array(10).keys()].map(n => `<option value="${n+1}" ${item.quantidade==n+1?'selected':''}>${n+1}</option>`).join('')}
                    </select>
                    <div class="subtotal-item"><p>R$ ${sub.toLocaleString('pt-BR')}</p></div>
                    <button onclick="excluirItemTotal(${index})" class="btn-lixeira">🗑️</button>
                </div>`;
            lista.appendChild(li);
        }
    });
    document.getElementById("total-carrinho").textContent = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function alterarQuantidade(i, q) {
    let c = JSON.parse(localStorage.getItem("carrinho"));
    c[i].quantidade = parseInt(q);
    localStorage.setItem("carrinho", JSON.stringify(c));
    renderizarCarrinho();
    atualizarContadorVisual();
}

function excluirItemTotal(i) {
    Swal.fire({ title: 'Remover?', text: "O item sairá do carrinho.", icon: 'question', showCancelButton: true, confirmButtonColor: '#22c55e', cancelButtonColor: '#ef4444', confirmButtonText: 'Sim', background: '#0a0f1e', color: '#fff' })
    .then((r) => { if (r.isConfirmed) { let c = JSON.parse(localStorage.getItem("carrinho")); c.splice(i, 1); localStorage.setItem("carrinho", JSON.stringify(c)); renderizarCarrinho(); atualizarContadorVisual(); } });
}

function limparCarrinho() {
    Swal.fire({ title: 'Esvaziar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#22c55e', cancelButtonColor: '#ef4444', confirmButtonText: 'Sim', background: '#0a0f1e', color: '#fff' })
    .then((r) => { if (r.isConfirmed) { localStorage.removeItem("carrinho"); renderizarCarrinho(); atualizarContadorVisual(); } });
}

/* FORMULÁRIOS E ESPECIFICAÇÕES */
function carregarDetalhesProduto() {
    const id = new URLSearchParams(window.location.search).get("produto");
    const p = dadosProdutos.find(prod => prod.id === id);
    if (p && document.getElementById("nome")) {
        document.getElementById("nome").textContent = p.nome;
        document.getElementById("preco").textContent = `R$ ${p.preco.toLocaleString('pt-BR')}`;
        document.getElementById("imagem").src = p.img;
        document.getElementById("descricao").textContent = p.desc;
        document.getElementById("btn-comprar-detalhe").onclick = () => adicionarCarrinho(p.id);
    }
}

function inicializarFormulario() {
    const form = document.getElementById("form-contato");
    if (!form) return;
    const urgencia = document.getElementById("urgencia");
    const campoNasc = document.getElementById("nascimento");

    if (campoNasc) {
        const dataLimite = new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate());
        campoNasc.setAttribute("max", dataLimite.toISOString().split('T')[0]);
    }

    if (urgencia) {
        const atualizarBarra = () => {
            const perc = (urgencia.value - 1) * 100 / 4;
            urgencia.style.backgroundSize = perc + '% 100%';
            document.getElementById("valorUrgencia").textContent = urgencia.value;
        };
        urgencia.addEventListener("input", atualizarBarra);
        atualizarBarra();
    }

    document.getElementById("telefone")?.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !v[2] ? v[1] : '(' + v[1] + ') ' + v[2] + (v[3] ? '-' + v[3] : '');
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const idade = new Date().getFullYear() - new Date(campoNasc.value).getFullYear();
        if (idade < 10) { Swal.fire({ title: 'Erro', text: 'Mínimo 10 anos.', icon: 'error', background: '#0a0f1e', color: '#fff' }); return; }
        Swal.fire({ title: 'Enviado!', icon: 'success', background: '#0a0f1e', color: '#fff' });
        form.reset();
        const event = new Event('input'); urgencia?.dispatchEvent(event);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("vitrine-produtos")) aplicarFiltrosEOrdenacao();
    carregarDetalhesProduto();
    inicializarFormulario();
    if (document.getElementById("lista-carrinho")) renderizarCarrinho();
    atualizarContadorVisual();
});