const fieldNome = document.querySelector("[data-field='nome']");
const fieldEmail = document.querySelector("[data-field='email']");
const fieldTelefone = document.querySelector("[data-field='telefone']");
const fieldCargo = document.querySelector("[data-field='cargo']");
const fieldFaturamento = document.querySelector("[data-field='faturamento']");
const fieldFuncionarios = document.querySelector("[data-field='funcionarios']");
const fieldConsent = document.querySelector("input[name='consent']");

const buttonSubmit = document.querySelector(".form-submit");

buttonSubmit.addEventListener("click", (e) => {
    if (fieldNome.value.trim() === "") {
        showPopUpValidation(e, fieldNome, "Informe seu nome");
    } else if (!validateSpecialCharacters(fieldNome)) {
        showPopUpValidation(e, fieldNome, "O campo permite apenas letras");
    } else if (!validacaoEmail(fieldEmail.value.toLowerCase())) {
        showPopUpValidation(e, fieldEmail, "Informe seu e-mail");
    } else if (!emailCorporativo(fieldEmail.value.toLowerCase())) {
        showPopUpValidation(e, fieldEmail, "Informe um e-mail corporativo");
    } else if (fieldTelefone.value.length < 13) {
        showPopUpValidation(e, fieldTelefone, "Informe seu telefone");
    } else if (
        fieldTelefone.value == "(99) 9999-9999" ||
        fieldTelefone.value == "(00) 0000-0000" ||
        fieldTelefone.value == "(11) 1111-1111" ||
        fieldTelefone.value == "(22) 2222-2222" ||
        fieldTelefone.value == "(33) 3333-3333" ||
        fieldTelefone.value == "(44) 4444-4444" ||
        fieldTelefone.value == "(55) 5555-5555" ||
        fieldTelefone.value == "(66) 6666-6666" ||
        fieldTelefone.value == "(77) 7777-7777" ||
        fieldTelefone.value == "(88) 8888-8888" ||
        fieldTelefone.value == "(99) 99999-9999" ||
        fieldTelefone.value == "(00) 00000-0000" ||
        fieldTelefone.value == "(11) 11111-1111" ||
        fieldTelefone.value == "(22) 22222-2222" ||
        fieldTelefone.value == "(33) 33333-3333" ||
        fieldTelefone.value == "(44) 44444-4444" ||
        fieldTelefone.value == "(55) 55555-5555" ||
        fieldTelefone.value == "(66) 66666-6666" ||
        fieldTelefone.value == "(77) 77777-7777" ||
        fieldTelefone.value == "(88) 88888-8888"
    ) {
        showPopUpValidation(e, fieldTelefone, "Informe um telefone válido");
    } else if (fieldCargo.value == "") {
        showPopUpValidation(e, fieldCargo, "Informe seu cargo");
    } else if (fieldFaturamento.value == "") {
        showPopUpValidation(e, fieldCargo, "Informe o faturamento");
    } else if (fieldFuncionarios.value == "") {
        showPopUpValidation(
            e,
            fieldFuncionarios,
            "Informe o número de funcionários da empresa"
        );
    } else if (!fieldConsent.checked) {
        showPopUpValidation(
            e,
            fieldConsent,
            "É necessário concordar em receber comunicações"
        );
    } else {
        const data = [];

        data.push(
            { name: "identificador", value: "transformacao-digital-seidor-up" },
            {
                name: "token_rdstation",
                value: "44b44412486e2dd8a5017dc602ce1d3f",
            },
            { name: "privacy_data[communications]", value: "1" },
            {
                name: "form_url",
                value: location.href,
            }
        );

        const fields = document.querySelectorAll("[data-field]");
        fields.forEach((field) => {
            data.push({ name: field.name, value: field.value });
        });

        console.log(data);

        RdIntegration.post(data);

        buttonSubmit.style.pointerEvents = "none";
        buttonSubmit.textContent = "Enviando...";

        setTimeout(() => {
            window.location.href =
                "https://hml.bowe.com.br/seidor/transformacao-digital-seidor-up/obrigado.html";
        }, 1500);

        return true;
    }
    return false;
});

// Swal fire popup
function showPopUpValidation(event, field, message) {
    Swal.fire({
        icon: "warning",
        text: message,
        timer: 2500,
        onAfterClose: () => {
            field.focus();
        },
    });

    event.preventDefault();
}

//Email validations
function validacaoEmail(email) {
    var verifica =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return verifica.test(String(email).toLowerCase());
}

function emailCorporativo(email) {
    const invalidDomains = [
        "@gmail.",
        "@yahoo.",
        "@hotmail.",
        "@live.",
        "@aol.",
        "@outlook.",
        "@terra.",
        "@bol.",
        "@uol.",
    ];

    for (let i = 0; i < invalidDomains.length; i++) {
        const domain = invalidDomains[i];
        if (email.indexOf(domain) != -1) {
            return false;
        }
    }
    return true;
}

setTimeout(function () {
    document.querySelector("input[name='url_pagina']").value =
        location.protocol + "//" + location.host + location.pathname;
}, 2000);

// Query Form
const queryForm = function (settings) {
    const reset = settings && settings.reset ? settings.reset : false;
    const self = window.location.toString();
    const querystring = self.split("?");
    if (querystring.length > 1) {
        const pairs = querystring[1].split("&");
        for (i in pairs) {
            var keyval = pairs[i].split("=");
            if (reset || sessionStorage.getItem(keyval[0]) === null) {
                sessionStorage.setItem(
                    keyval[0],
                    decodeURIComponent(keyval[1])
                );
            }
        }
    }
    const hiddenFields = document.querySelectorAll(
        "input[type=hidden], input[type=text]"
    );
    for (let i = 0; i < hiddenFields.length; i++) {
        const param = sessionStorage.getItem(hiddenFields[i].name);
        if (param)
            document.getElementsByName(hiddenFields[i].name)[0].value = param;
    }
};

setTimeout(() => {
    queryForm();
}, 2000);

// ------------------------- Phone Mask -------------------------
fieldTelefone.addEventListener("input", handlePhoneInput, false);

function handlePhoneInput(e) {
    e.target.value = phoneMask(e.target.value);
}

function phoneMask(phone) {
    return phone
        .replace(/\D/g, "")
        .replace(/^(\d)/, "($1")
        .replace(/^(\(\d{2})(\d)/, "$1) $2")
        .replace(/(\d{5})(\d{1,4})/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
}

// Simulate Enter click
document.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            buttonSubmit.click();
        }
    });
});

function validateSpecialCharacters(field) {
    if (!/^[a-záàâãéèêíïóôõöúçñ ]+$/i.test(field.value)) {
        return false;
    } else {
        return true;
    }
}
