// Executa ao carregar conteúdo da página
$(document).ready(() => {
  // Slick Carousel
  $("#partners").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 745,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  // Configuração de script
  var SPMaskBehavior = function (val) {
      return val.replace(/\D/g, "").length === 11
        ? "(00) 00000-0000"
        : "(00) 0000-00009";
    },
    spOptions = {
      onKeyPress: function (val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
      },
    };

  $("input[type='tel']").mask(SPMaskBehavior, spOptions);

  //Insere campos de UTM's e URL_Pagina automaticamente
  const params = new URLSearchParams(window.location.search);
  $("form").append(
    $(
      `<input class="required" type="hidden" name="utm_medium" value="${params.get(
        "utm_medium"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="utm_source" value="${params.get(
        "utm_source"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="utm_campaign" value="${params.get(
        "utm_campaign"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="utm_term" value="${params.get(
        "utm_term"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="utm_content" value="${params.get(
        "utm_content"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="url_pagina" value="${location.href}" />`
    )
  );

  // Insere campos que identificam a origem do lead
  $("form").append(
    $(
      `<input class="required" type="hidden" name="traffic_source" value="${params.get(
        "utm_source"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="traffic_medium" value="${params.get(
        "utm_medium"
      )}" />`
    )
  );
  $("form").append(
    $(
      `<input class="required" type="hidden" name="traffic_campaign" value="${params.get(
        "utm_campaign"
      )}" />`
    )
  );

  $("form").append(
    $(
      `<input class="required" type="hidden" name="traffic_value" value="${params.get(
        "utm_content"
      )}" />`
    )
  );

  $("#segmento").on("change", function (e) {
    let fieldSelected = $(this).find(":selected").val();

    if (fieldSelected === "Indústria") {
      $("#tipo-industria").show();
      $("#tipo-industria").addClass("required");
      $("#tipo-servico").hide();
      $("#tipo-servico").removeClass("required");
    } else if (fieldSelected === "Serviços") {
      $("#tipo-servico").show();
      $("#tipo-servico").addClass("required");
      $("#tipo-industria").hide();
      $("#tipo-industria").removeClass("required");
    } else {
      $("#tipo-industria").hide();
      $("#tipo-servico").hide();
      $("#tipo-servico").removeClass("required");
      $("#tipo-servico").removeClass("required");
    }
  });
});

//Ação quando submita o formulário
$("button#submit-button").on("click", function () {
  let formContainer = $(this).closest("form");
  let inputFields = $(formContainer).find("input.required");
  let selectFields = $(formContainer).find("select.required");

  if (validateEmptyFields(inputFields, selectFields))
    convertLeadRDStation(inputFields, selectFields);
});

function convertLeadRDStation(inputs, selects) {
  const dataLead = [];
  inputs.each((key, item) => {
    var valueField;
    // Se for Accept Legal convert o value para sim ou nao
    if ($(item).attr("type") === "checkbox" && $(item).val() === "on") {
      valueField = $(item).is(":checked") ? "Sim" : "Não";
    } else {
      valueField = $(item).val();
    }
    dataLead.push({ name: $(item).attr("name"), value: valueField });
  });

  selects.each((key, item) => {
    dataLead.push({ name: $(item).attr("name"), value: $(item).val() });
  });

  dataLead.push(
    { name: "token_rdstation", value: "44b44412486e2dd8a5017dc602ce1d3f" },
    {
      name: "identificador",
      value: "contacao-seidor-up",
    }
  );

  RdIntegration.post(dataLead);

  $("input").val("");
  $("select").val("");

  setTimeout(() => {
    window.location.href =
      "https://seidor.com.br/agradecimento-cotacao-seidor-up";
  }, 1000);
}

// Força digitar apenas letras no campo nome
$("input[name=name]").keyup(function () {
  this.value = this.value.replace(
    /[^A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]/g,
    ""
  );
});

// Validação no formato de e-mail
function validacaoEmail(email) {
  var verifica =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return verifica.test(String(email).toLowerCase());
}

// Validação de e-mail corporativo
var invalidDomains = [
  "@gmail.",
  "@yahoo.",
  "@hotmail.",
  "@live.",
  "@aol.",
  "@outlook.",
  "@bol.",
  "@uol.",
  "@icloud.",
  "@ig.",
];

function emailCorporativo(email) {
  const emailNormalized = String(email).toLowerCase();
  for (var i = 0; i < invalidDomains.length; i++) {
    var domain = invalidDomains[i];
    if (emailNormalized.indexOf(domain) != -1) {
      return false;
    }
  }
  return true;
}

// Faz a validação dos campos vazios
function validateEmptyFields(inputs, selects) {
  let spanFields = $("form").find("span");
  // Reseta as mesagens
  spanFields.remove();

  // Verificar se os inputs estão vazios
  inputs.each((key, item) => {
    var valueField = $(item);

    // Verificação no input do tipo checkbox
    if (
      valueField.attr("type") === "checkbox" &&
      valueField.is(":checked") === false
    ) {
      $(valueField)
        .closest("label")
        .after(
          "<span class='error-accept-legal'>É necessário aceitar os termos.</span>"
        );
    } else if (
      valueField.attr("type") === "tel" &&
      $(valueField).val().length > 0 &&
      $(valueField).val().length <= 13
    ) {
      $(valueField).after(
        "<span class='error'>Número de telefone incompleto ou no formato incorreto.</span>"
      );
    }

    // Validação de e-mail
    if (valueField.attr("name") === "email") {
      if (valueField.val().length > 3 && !validacaoEmail(valueField.val()))
        $(valueField).after(
          "<span class='error'>Formato de e-mail inválido.</span>"
        );

      if (!emailCorporativo(valueField.val()))
        $(valueField).after(
          "<span class='error'>Utilize um e-mail corporativo.</span>"
        );
    }

    if (valueField.val().length === 0) {
      valueField.after(
        "<span class='error'>O campo não pode ser vazio.</span>"
      );
    }
  });

  // Verificar se os selects estão vazios
  selects.each((key, item) => {
    var valueField = $(item);

    if (valueField.val().length === 0) {
      console.log(valueField.attr("name"), valueField.val());
      valueField.after("<span class='error'>Selecione uma opção.</span>");
    }
  });

  inputEmptyFields = inputs.filter((key, el) => {
    return $(el).val().length === 0;
  });

  selectEmptyFields = selects.filter((key, el) => {
    return $(el).val().length === 0;
  });

  if (
    inputEmptyFields.length !== 0 ||
    selectEmptyFields.length !== 0 ||
    $("input[type=checkbox]:checked").length === 0 ||
    !validacaoEmail($("input[type=email]").val()) ||
    !emailCorporativo($("input[type=email]").val())
  ) {
    return false;
  } else {
    return true;
  }
}

// Ao clicar ele rola a página até o ID definido
function scrollToForm(target = "#first") {
  document.querySelector(target).scrollIntoView({
    behavior: "smooth",
  });
}

// Abre o Modal no modo responsivo
function handleModal(status) {
  let formElement = $(".box-form").closest(".box");
  if (status) {
    $(formElement).addClass("open");
    $("body").attr("style", "overflow: hidden");
    scrollToForm("#logo");
  } else {
    $(formElement).removeClass("open");
    $("body").attr("style", "overflow: auto");
  }
}

//Mostra o conteúdo do collapse
function handleOpenContent(classElement) {
  let element = $(`.steps-large-devices ${classElement}`);
  let content = $(element).find(".content");

  if (!$(content).hasClass("show")) {
    $(content).addClass("show");
    $(content).slideDown();
  } else {
    $(content).removeClass("show");
    $(content).slideUp("slide");
  }
}

//Mostra o modal com conteúdo do content, criado para responsividade
function handleOpenModalPopup(classElement) {
  let element = $(`.steps-small-devices ${classElement}`);
  let content = $(element).find(".content");
  if (!$(content).hasClass("show")) {
    $(content).addClass("show");
  } else {
    $(content).removeClass("show");
  }
}
