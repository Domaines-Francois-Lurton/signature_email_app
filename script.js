const companySelect = document.getElementById("company");
const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const fonctionInput = document.getElementById("fonction");
const tel1Input = document.getElementById("tel1");
const tel2Input = document.getElementById("tel2");
const emailInput = document.getElementById("email");
const preview = document.getElementById("signature-preview");
const copyBtn = document.getElementById("copy-btn");
const copyStatus = document.getElementById("copy-status");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function populateCompanies() {
  COMPANIES.forEach((company) => {
    const opt = document.createElement("option");
    opt.value = company.id;
    opt.textContent = company.name;
    companySelect.appendChild(opt);
  });
}

function getSelectedCompany() {
  return COMPANIES.find((c) => c.id === companySelect.value) || COMPANIES[0];
}

function buildSignatureHtml() {
  const company = getSelectedCompany();
  const prenom = escapeHtml(prenomInput.value.trim());
  const nom = escapeHtml(nomInput.value.trim());
  const fonction = escapeHtml(fonctionInput.value.trim());
  const tel1 = tel1Input.value.trim();
  const tel2 = tel2Input.value.trim();
  const email = escapeHtml(emailInput.value.trim());

  const fullName = [prenom, nom].filter(Boolean).join(" ");

  const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  let telLine = "";
  if (tel1) {
    telLine += `<a href="tel:${escapeHtml(tel1.replace(/[^+\d]/g, ""))}" style="font-family: ${FONT}; color: #000000; text-decoration: none;">${escapeHtml(tel1)}</a>`;
  }
  if (tel2) {
    telLine += `${tel1 ? " | " : ""}<a href="tel:${escapeHtml(tel2.replace(/[^+\d]/g, ""))}" style="font-family: ${FONT}; color: #000000; text-decoration: none;">${escapeHtml(tel2)}</a>`;
  }

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${FONT}; color: #000000; border-collapse: collapse; width: 450px; background-color: transparent;">
    <tr>
        <td align="center" valign="middle" style="vertical-align: middle; padding-bottom: 20px; width: 150px; background-color: transparent;">
            <a href="${company.website}" target="_blank" style="text-decoration: none;">
                <img src="${company.logoUrl}" alt="${escapeHtml(company.logoAlt)}" width="${company.logoWidth}" style="display: block; border: 0; margin: 0 auto; background-color: transparent;">
            </a>
        </td>

        <td valign="middle" style="vertical-align: middle; padding-bottom: 20px; border-left: 1px solid #eeeeee; padding-left: 30px; background-color: transparent;">
            <div style="font-family: ${FONT}; font-size: 14px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; color: #000000; margin-bottom: 2px;">
                ${fullName || "Prénom Nom"}
            </div>
            <div style="font-family: ${FONT}; font-size: 12px; font-weight: 400; color: #888888; margin-bottom: 12px;">
                ${fonction || "Fonction"}
            </div>
            <div style="font-family: ${FONT}; font-size: 11px; font-weight: 400; color: #000000; line-height: 1.5;">
                ${telLine}${telLine ? "<br>" : ""}
                <a href="mailto:${email}" style="font-family: ${FONT}; color: #000000; text-decoration: none;">${email || "email@" + company.emailDomain}</a>
            </div>
        </td>
    </tr>

    <tr>
        <td colspan="2" align="center" style="border-top: 1px solid #eeeeee; padding-top: 12px; text-align: center; background-color: transparent;">
            <div style="font-family: ${FONT}; font-size: 8px; font-weight: 400; color: #bbbbbb; letter-spacing: 0.1em; text-transform: uppercase;">
                ${escapeHtml(company.address)}
            </div>
        </td>
    </tr>
</table>`;
}

function renderPreview() {
  preview.innerHTML = buildSignatureHtml();
}

function buildPlainTextFallback() {
  return preview.textContent.replace(/\s+/g, " ").trim();
}

async function copySignature() {
  const html = buildSignatureHtml();
  const text = buildPlainTextFallback();

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      });
      await navigator.clipboard.write([item]);
      copyStatus.textContent = "Copié !";
    } else {
      throw new Error("Clipboard API non disponible");
    }
  } catch (err) {
    // Repli sur l'ancienne méthode si l'API Clipboard n'est pas disponible.
    const range = document.createRange();
    range.selectNode(preview);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand("copy");
      copyStatus.textContent = "Copié !";
    } catch (fallbackErr) {
      copyStatus.textContent = "Échec de la copie.";
    }
    selection.removeAllRanges();
  }

  if (copyStatus.textContent === "Copié !" && typeof confetti === "function") {
    const rect = copyBtn.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    };
    confetti({
      particleCount: 100,
      spread: 70,
      origin
    });
  }

  setTimeout(() => (copyStatus.textContent = ""), 2500);
}

[companySelect, prenomInput, nomInput, fonctionInput, tel1Input, tel2Input, emailInput].forEach((el) => {
  el.addEventListener("input", renderPreview);
});
companySelect.addEventListener("change", renderPreview);
copyBtn.addEventListener("click", copySignature);

const tutorialEmoji = document.getElementById("tutorial-emoji");
let gearClickCount = 0;
let gearClickTimer = null;

function launchPartyMode() {
  document.body.classList.add("party-mode");
  setTimeout(() => document.body.classList.remove("party-mode"), 2500);

  if (typeof confetti !== "function") return;

  const duration = 2500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 } });
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

tutorialEmoji.addEventListener("click", () => {
  gearClickCount += 1;
  clearTimeout(gearClickTimer);
  gearClickTimer = setTimeout(() => (gearClickCount = 0), 1500);

  if (gearClickCount >= 10) {
    gearClickCount = 0;
    launchPartyMode();
  }
});

populateCompanies();
renderPreview();
