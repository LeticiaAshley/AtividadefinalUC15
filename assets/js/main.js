let carrinho = [];

let estoques = {

    "camisa-brasil": 10,
    "short-franca": 15,
    "short-franca-2": 8,
    "bone-portugal": 12,
    "short-brasil-1": 10,
    "short-brasil-2": 8,
    "short-brasil-3": 12,
    "short-brasil-4": 6,
    "short-brasil-5": 15,
    "camisa-brasil-1": 10,
    "camisa-brasil-2": 8,
    "camisa-brasil-3": 12,
    "camisa-brasil-4": 7,
    "camisa-brasil-5": 15,
    "calca-brasil-1": 10,
    "calca-brasil-2": 8,
    "bone-brasil-1": 10,
"bone-brasil-2": 8,
"bone-brasil-3": 15,
"short-franca-1": 10,
"short-franca-2": 8,
"short-franca-3": 12,
"short-franca-4": 6,
"short-franca-5": 15,
"short-portugal-1": 10,
"short-portugal-2": 8,
"short-portugal-3": 12,
"short-portugal-4": 6,
"short-portugal-5": 15,
"bone-frança-1": 10,
"bone-frança-2": 8,
"bone-frança-3": 15,
"bone-portugal-1": 10,
"bone-portugal-2": 8,
"bone-portugal-3": 15,
"camisa-franca-1": 10,
"camisa-franca-2": 8,
"camisa-franca-3": 12,
"camisa-franca-4": 7,
"camisa-franca-5": 15,
"camisa-portugal-1": 10,
"camisa-portugal-2": 8,
"camisa-portugal-3": 12,
"camisa-portugal-4": 7,
"camisa-portugal-5": 15

};

function adicionarCarrinho(nome, preco, imagem, idEstoque, idTamanho){
    let tamanhoInput = document.getElementById(idTamanho);
    if(!tamanhoInput){
        alert("Tamanho inválido. Atualize a página e tente novamente.");
        return;
    }

    let tamanho = tamanhoInput.value;
    if(!estoques.hasOwnProperty(idEstoque) || estoques[idEstoque] <= 0){
        alert("Produto sem estoque!");
        return;
    }

    let itemExistente = carrinho.find(produto =>
        produto.nome === nome &&
        produto.tamanho === tamanho
    );

    if(itemExistente){
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome,
            preco,
            imagem,
            tamanho,
            idEstoque,
            quantidade: 1
        });
    }

    estoques[idEstoque]--;
    atualizarEstoque(idEstoque);
    atualizarCarrinho();
}

function atualizarEstoque(idEstoque){
    let elemento = document.getElementById("estoque-" + idEstoque);
    if(!elemento) return;
    elemento.innerText = estoques[idEstoque] ?? 0;
}

function atualizarCarrinho(){
    let lista = document.getElementById("lista-carrinho");
    let totalElemento = document.getElementById("total");
    let total = 0;

    if(lista){
        lista.innerHTML = "";
    }

    carrinho.forEach((produto, index)=>{
        let subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        if(lista){
            lista.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
                <img src="${produto.imagem}" width="70" height="70" style="object-fit: cover; border-radius: 10px;">
                <div>
                    <strong>${produto.nome}</strong><br>
                    Tamanho: ${produto.tamanho}<br>
                    Quantidade: ${produto.quantidade}<br>
                    R$ ${subtotal.toFixed(2)}
                </div>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-success" onclick="incrementarCarrinho(${index})">+</button>
                <button class="btn btn-outline-danger" onclick="removerCarrinho(${index})">-</button>
            </div>
        </li>
        `;
        }
    });

    if(totalElemento){
        totalElemento.innerText = total.toFixed(2);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    localStorage.setItem("estoques", JSON.stringify(estoques));
}

function removerCarrinho(index){
    if(index < 0 || index >= carrinho.length){
        return;
    }

    let produto = carrinho[index];
    if(!produto){
        return;
    }

    if(estoques.hasOwnProperty(produto.idEstoque)){
        estoques[produto.idEstoque]++;
        atualizarEstoque(produto.idEstoque);
    }

    produto.quantidade--;
    if(produto.quantidade <= 0){
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}

function incrementarCarrinho(index){
    if(index < 0 || index >= carrinho.length){
        return;
    }

    let produto = carrinho[index];
    if(!produto){
        return;
    }

    if(!estoques.hasOwnProperty(produto.idEstoque) || estoques[produto.idEstoque] <= 0){
        alert("Estoque insuficiente para aumentar a quantidade.");
        return;
    }

    produto.quantidade++;
    estoques[produto.idEstoque]--;
    atualizarEstoque(produto.idEstoque);
    atualizarCarrinho();
}

function carregarDados(){
    let dados = localStorage.getItem("carrinho");
    if(dados){
        try{
            let parsed = JSON.parse(dados);
            if(Array.isArray(parsed)){
                carrinho = parsed;
            }
        }catch{
            carrinho = [];
        }
    }

    let estoqueSalvo = localStorage.getItem("estoques");
    if(estoqueSalvo){
        try{
            let parsed = JSON.parse(estoqueSalvo);
            if(parsed && typeof parsed === "object"){
                estoques = parsed;
            }
        }catch{
            // manter estoques padrão
        }
    }
}


function filtrarProdutos(){
    let pesquisa = document.getElementById("pesquisa")?.value.toLowerCase() || "";
    let filtro = document.getElementById("filtro-categoria")?.value || "";
    let produtos = document.querySelectorAll(".produto");

    produtos.forEach((produto)=>{
        let nome = produto.innerText.toLowerCase();
        let categoria = produto.dataset.categoria || "";
        let matchesSearch = nome.includes(pesquisa);
        let matchesFilter = !filtro || categoria === filtro;
        produto.style.display = (matchesSearch && matchesFilter) ? "block" : "none";
    });
}

function configurarPesquisa(){
    let pesquisa = document.getElementById("pesquisa");
    if(!pesquisa) return;

    pesquisa.addEventListener("keyup", filtrarProdutos);
}

function configurarFiltroCategoria(){
    let filtro = document.getElementById("filtro-categoria");
    if(!filtro) return;

    filtro.addEventListener("change", filtrarProdutos);
}

function redirecionar(select){
    let link = select.value;
    if(link){
        window.location.href = link;
    }
}

function configurarFormulario(){
    let formulario = document.querySelector("form");
    if(!formulario) return;

    formulario.addEventListener("submit", function(event){
        event.preventDefault();
        alert("Mensagem enviada com sucesso!");
        formulario.reset();
    });
}

function configurarPaypal(){
    let container = document.getElementById("paypal-button-container");
    if(!container || !window.paypal) return;

    paypal.Buttons({
        createOrder: function(data, actions){
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById("total")?.innerText || "0.00"
                    }
                }]
            });
        },
        onApprove: function(data, actions){
            return actions.order.capture().then(function(details){
                alert("Pagamento realizado com sucesso!");
            });
        }
    }).render('#paypal-button-container');
}

function inicializar(){
    carregarDados();

    for(let id in estoques){
        atualizarEstoque(id);
    }

    atualizarCarrinho();
    configurarPesquisa();
    configurarFiltroCategoria();
    configurarFormulario();
    configurarPaypal();
}

document.addEventListener("DOMContentLoaded", inicializar);

  



        // PEGAR FORMULÁRIO
        const formulario = document.getElementById("formContato");

        // ENVIAR FORMULÁRIO
        formulario.addEventListener("submit", function(event){

            // NÃO RECARREGA A PÁGINA
            event.preventDefault();

            // ALERTA
            alert("Mensagem enviada com sucesso!");

            // LIMPA OS CAMPOS
            formulario.reset();

        });

    


