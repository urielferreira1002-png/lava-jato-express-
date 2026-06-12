/* ========== PREÇOS ========== */
const precos = {
    "Lavagem Simples": 30,
    "Lavagem Completa": 60,
    "Higienização": 120,
    "Polimento": 250
};

/* ========== LOADER ========== */
window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        if (!loader) return;
        loader.style.transition = "opacity .8s ease";
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 800);
    }, 2600);
});

/* ========== BLOQUEAR DATAS PASSADAS ========== */
const dataInput = document.getElementById("data");
if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);
}

/* ========== VERIFICAR HORÁRIOS OCUPADOS ========== */
const horaSelect = document.getElementById("hora");

function verificarHorarios() {
    if (!dataInput || !horaSelect) return;
    const dataSelecionada = dataInput.value;
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const horariosOcupados = agendamentos
        .filter(a => a.data === dataSelecionada)
        .map(a => a.hora);

    [...horaSelect.options].forEach(option => {
        if (option.value === "") return;
        option.disabled = horariosOcupados.includes(option.value);
        option.text = option.disabled
            ? option.value + " (ocupado)"
            : option.value;
    });
}

if (dataInput) {
    dataInput.addEventListener("change", verificarHorarios);
}

/* ========== CARREGAR GALERIA DO ADMIN ========== */
function carregarGaleriaPublica() {
    const div = document.getElementById("galeriaPublica");
    if (!div) return;
    const galeria = JSON.parse(localStorage.getItem("galeria")) || [];
    if (galeria.length === 0) return;
    galeria.forEach(foto => {
        const item = document.createElement("div");
        item.className = "foto";
        item.innerHTML = `<img src="${foto}" alt="Foto do serviço">`;
        div.appendChild(item);
    });
}
carregarGaleriaPublica();

/* ========== FORMULÁRIO DE AGENDAMENTO ========== */
const formulario = document.getElementById("formAgendamento");

if (formulario) {
    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        const nome     = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const veiculo  = document.getElementById("veiculo").value.trim();
        const placa    = document.getElementById("placa").value.trim().toUpperCase();
        const servico  = document.getElementById("servico").value;
        const data     = document.getElementById("data").value;
        const hora     = document.getElementById("hora").value;

        // Validação básica
        if (!nome || !telefone || !veiculo || !placa || !servico || !data || !hora) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const valor = precos[servico] || 0;

        // Salvar no localStorage
        const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
        const novoAgendamento = {
            nome,
            telefone,
            veiculo,
            placa,
            servico,
            valor,
            data,
            hora,
            pontos: 1,
            criadoEm: new Date().toISOString()
        };
        agendamentos.push(novoAgendamento);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

        // Mostrar mensagem de sucesso
        const msg = document.getElementById("msgSucesso");
        if (msg) {
            msg.style.display = "block";
            setTimeout(() => { msg.style.display = "none"; }, 5000);
        }

        // Montar mensagem WhatsApp
        const mensagem =
`🚗 *NOVO AGENDAMENTO — Lava Jato Express*

👤 Cliente: ${nome}
📱 WhatsApp: ${telefone}
🚘 Veículo: ${veiculo}
🔖 Placa: ${placa}
🧽 Serviço: ${servico}
💰 Valor: R$ ${valor}
📅 Data: ${data.split("-").reverse().join("/")}
⏰ Hora: ${hora}

_Aguardo a confirmação!_`;

        const numero = "5531953025800";
        const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(link, "_blank");

        // Resetar formulário
        formulario.reset();
        verificarHorarios();
    });
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}