
if(
localStorage.getItem("logado")
!== "sim"
){

    window.location =
    "login.html";

}const lista = document.getElementById("listaAgendamentos");

const agendamentos =
JSON.parse(localStorage.getItem("agendamentos")) || [];

document.getElementById("totalClientes").innerText =
agendamentos.length;

document.getElementById("totalAgendamentos").innerText =
agendamentos.length;

function carregarAgendamentos(){

    lista.innerHTML = "";

    agendamentos.forEach((item, index)=>{

        lista.innerHTML += `
        <div class="card">

        <button onclick="gerarRecibo(${index})">
📄 Gerar Recibo
</button>

            <h3>${item.nome}</h3>

            <p><strong>Telefone:</strong> ${item.telefone}</p>

            <p><strong>Veículo:</strong> ${item.veiculo}</p>

            <p><strong>Placa:</strong> ${item.placa}</p>

            <p><strong>Serviço:</strong> ${item.servico}</p>

            <p><strong>Data:</strong> ${item.data}</p>

            <p><strong>Hora:</strong> ${item.hora}</p>

            <button onclick="excluir(${index})">
                Excluir
            </button>

        </div>
        `;
    });
}

function excluir(index){

    agendamentos.splice(index,1);

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(agendamentos)
    );

    location.reload();
}

carregarAgendamentos();
function logout(){

    localStorage.removeItem("logado");

    window.location.href =
    "login.html";

}
let faturamento = 0;

agendamentos.forEach(item => {
    faturamento += Number(item.valor || 0);
});

document.getElementById("faturamentoTotal")
.innerText =
`R$ ${faturamento.toFixed(2)}`;

const ticket =
agendamentos.length > 0
? faturamento / agendamentos.length
: 0;

document.getElementById("ticketMedio")
.innerText =
`R$ ${ticket.toFixed(2)}`;
const hoje =
new Date().toISOString().split("T")[0];

const agendaHoje =
agendamentos.filter(
a => a.data === hoje
);

const agendaDiv =
document.getElementById("agendaHoje");

agendaHoje.forEach(item => {

    agendaDiv.innerHTML += `
        <div class="card">
            ${item.hora} - ${item.nome}
            (${item.servico})
        </div>
    `;
});
const galeria =
JSON.parse(localStorage.getItem("galeria")) || [];

function salvarFoto(){

    const arquivo =
    document.getElementById("fotoUpload")
    .files[0];

    if(!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e){

        galeria.push(e.target.result);

        localStorage.setItem(
            "galeria",
            JSON.stringify(galeria)
        );

        carregarGaleria();

    };

    leitor.readAsDataURL(arquivo);
}

function carregarGaleria(){

    const div =
    document.getElementById("galeriaAdmin");

    div.innerHTML = "";

    galeria.forEach((foto,index)=>{

        div.innerHTML += `
        <div>

            <img src="${foto}">

            <button onclick="excluirFoto(${index})">
                Excluir
            </button>

        </div>
        `;
    });

}

function excluirFoto(index){

    galeria.splice(index,1);

    localStorage.setItem(
        "galeria",
        JSON.stringify(galeria)
    );

    carregarGaleria();
}

carregarGaleria();
const ranking = {};

agendamentos.forEach(cliente => {

    if(!ranking[cliente.telefone]){

        ranking[cliente.telefone] = {
            nome: cliente.nome,
            pontos: 0
        };

    }

    ranking[cliente.telefone].pontos++;

});

const rankingDiv =
document.getElementById("rankingClientes");

Object.values(ranking)

.sort((a,b)=>b.pontos-a.pontos)

.forEach(cliente=>{

    rankingDiv.innerHTML += `
        <div class="card">

            <h3>${cliente.nome}</h3>

            <p>
                ⭐ ${cliente.pontos} pontos
            </p>

        </div>
    `;
});Object.values(ranking)

.forEach(cliente=>{

    if(cliente.pontos >= 10){

        rankingDiv.innerHTML += `
            <div class="card">

                🎁 ${cliente.nome}
                ganhou uma lavagem grátis!

            </div>
        `;

    }

});
function gerarRecibo(index){

    const cliente = agendamentos[index];

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text(
        "LAVA JATO EXPRESS",
        20,
        20
    );

    pdf.setFontSize(12);

    pdf.text(
        `Cliente: ${cliente.nome}`,
        20,
        40
    );

    pdf.text(
        `Telefone: ${cliente.telefone}`,
        20,
        50
    );

    pdf.text(
        `Veículo: ${cliente.veiculo}`,
        20,
        60
    );

    pdf.text(
        `Serviço: ${cliente.servico}`,
        20,
        70
    );

    pdf.text(
        `Valor: R$ ${cliente.valor}`,
        20,
        80
    );

    pdf.text(
        `Data: ${cliente.data}`,
        20,
        90
    );

    pdf.save(
        `recibo-${cliente.nome}.pdf`
    );

}
function logout(){

    localStorage.removeItem(
        "logado"
    );

    window.location =
    "login.html";

}