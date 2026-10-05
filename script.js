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
const bannerCompanySelect = document.getElementById("banner-company");
const bannerPreview = document.getElementById("banner-preview");
const bannerCopyBtn = document.getElementById("banner-copy-btn");
const bannerCopyStatus = document.getElementById("banner-copy-status");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// Pour les valeurs placées dans un attribut HTML (escapeHtml n'échappe pas les guillemets).
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function populateCompanies(select) {
  COMPANIES.forEach((company) => {
    const opt = document.createElement("option");
    opt.value = company.id;
    opt.textContent = company.name;
    select.appendChild(opt);
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

  const logoImg = `<img src="${company.logoUrl}" alt="${escapeHtml(company.logoAlt)}" width="${company.logoWidth}" style="display: block; border: 0; margin: 0 auto; background-color: transparent;">`;
  const logoMarkup = company.website
    ? `<a href="${company.website}" target="_blank" style="text-decoration: none;">${logoImg}</a>`
    : logoImg;

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${FONT}; color: #000000; border-collapse: collapse; width: 450px; background-color: transparent;">
    <tr>
        <td align="center" valign="middle" style="vertical-align: middle; padding-bottom: 20px; width: 150px; background-color: transparent;">
            ${logoMarkup}
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
                <a href="mailto:${email}" style="font-family: ${FONT}; color: #000000; text-decoration: none;">${email || "jean.dupont@exemple.com"}</a>
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

function buildPlainTextFallback(el) {
  return el.textContent.replace(/\s+/g, " ").trim();
}

// Bandeaux enregistrés depuis l'interface (Worker). Une société absente garde
// le bandeau par défaut de config.js ; une valeur null signifie « aucun bandeau ».
let remoteBanners = {};

function getBanner(companyId) {
  if (Object.prototype.hasOwnProperty.call(remoteBanners, companyId)) {
    return remoteBanners[companyId];
  }
  return BANNERS[companyId] || null;
}

async function loadRemoteBanners() {
  if (!BANNERS_API_URL) return;
  try {
    const res = await fetch(`${BANNERS_API_URL}/banners`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remoteBanners = await res.json();
    renderBannerPreview();
  } catch (err) {
    console.warn("Bandeaux en ligne indisponibles, utilisation de config.js.", err);
  }
}

function buildBannerHtml(banner) {
  if (banner.type === "html") return banner.html;

  const width = banner.width || 450;
  const img = `<img src="${escapeAttr(banner.imageUrl)}" alt="${escapeAttr(banner.alt)}" width="${width}" style="display: block; border: 0; max-width: 100%; height: auto;">`;
  const content = banner.link
    ? `<a href="${escapeAttr(banner.link)}" target="_blank" style="text-decoration: none;">${img}</a>`
    : img;

  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: ${width}px;">
    <tr>
        <td style="padding: 0;">${content}</td>
    </tr>
</table>`;
}

function renderBannerPreview() {
  const banner = getBanner(bannerCompanySelect.value);
  if (banner) {
    bannerPreview.innerHTML = buildBannerHtml(banner);
  } else {
    bannerPreview.innerHTML = `<p class="banner-empty">Aucun bandeau en cours pour cette société.</p>`;
  }
  bannerCopyBtn.disabled = !banner;
}

async function copyHtml(html, previewEl, btn, statusEl) {
  const text = buildPlainTextFallback(previewEl) || " ";

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      });
      await navigator.clipboard.write([item]);
      statusEl.textContent = "Copié !";
    } else {
      throw new Error("Clipboard API non disponible");
    }
  } catch (err) {
    // Repli sur l'ancienne méthode si l'API Clipboard n'est pas disponible.
    const range = document.createRange();
    range.selectNode(previewEl);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand("copy");
      statusEl.textContent = "Copié !";
    } catch (fallbackErr) {
      statusEl.textContent = "Échec de la copie.";
    }
    selection.removeAllRanges();
  }

  if (statusEl.textContent === "Copié !" && typeof confetti === "function") {
    const rect = btn.getBoundingClientRect();
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

  setTimeout(() => (statusEl.textContent = ""), 2500);
}

function copySignature() {
  return copyHtml(buildSignatureHtml(), preview, copyBtn, copyStatus);
}

function copyBanner() {
  const banner = getBanner(bannerCompanySelect.value);
  if (!banner) return;
  return copyHtml(buildBannerHtml(banner), bannerPreview, bannerCopyBtn, bannerCopyStatus);
}

[companySelect, prenomInput, nomInput, fonctionInput, tel1Input, tel2Input, emailInput].forEach((el) => {
  el.addEventListener("input", renderPreview);
});
companySelect.addEventListener("change", renderPreview);
copyBtn.addEventListener("click", copySignature);
bannerCompanySelect.addEventListener("change", renderBannerPreview);
bannerCopyBtn.addEventListener("click", copyBanner);

// Onglets : la société choisie suit d'un onglet à l'autre.
const tabs = document.querySelectorAll(".tab");
function showTab(name) {
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    document.getElementById(`tab-${tab.dataset.tab}`).hidden = !active;
  });
  if (name === "banner") {
    bannerCompanySelect.value = companySelect.value;
    renderBannerPreview();
  } else {
    companySelect.value = bannerCompanySelect.value;
    renderPreview();
  }
}
tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));

// Déclenche callback après 10 clics rapprochés sur el.
function onTenClicks(el, callback) {
  let count = 0;
  let timer = null;
  el.addEventListener("click", () => {
    count += 1;
    clearTimeout(timer);
    timer = setTimeout(() => (count = 0), 1500);
    if (count >= 10) {
      count = 0;
      callback();
    }
  });
}

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

onTenClicks(document.getElementById("tutorial-emoji"), launchPartyMode);

// Édition des bandeaux (accès : 10 clics sur 🖼️ dans l'onglet Bandeau).
const adminDialog = document.getElementById("banner-admin");
const adminForm = document.getElementById("banner-admin-form");
const adminCompany = document.getElementById("admin-company");
const adminType = document.getElementById("admin-type");
const adminImageFields = document.getElementById("admin-image-fields");
const adminHtmlFields = document.getElementById("admin-html-fields");
const adminImageUrl = document.getElementById("admin-image-url");
const adminLink = document.getElementById("admin-link");
const adminAlt = document.getElementById("admin-alt");
const adminWidth = document.getElementById("admin-width");
const adminHtml = document.getElementById("admin-html");
const adminPreview = document.getElementById("admin-preview");
const adminPassword = document.getElementById("admin-password");
const adminRemember = document.getElementById("admin-remember");
const adminStatus = document.getElementById("admin-status");
const adminSave = document.getElementById("admin-save");
const PASSWORD_STORAGE_KEY = "bannerAdminPassword";

function setAdminStatus(message, kind = "") {
  adminStatus.textContent = message;
  adminStatus.className = `admin-status ${kind}`;
}

// Un champ principal vide (HTML ou adresse de l'image) vaut « aucun bandeau ».
function readAdminBanner() {
  if (adminType.value === "none") return null;
  if (adminType.value === "html") {
    return adminHtml.value.trim() ? { type: "html", html: adminHtml.value } : null;
  }
  if (!adminImageUrl.value.trim()) return null;
  return {
    type: "image",
    imageUrl: adminImageUrl.value.trim(),
    link: adminLink.value.trim(),
    alt: adminAlt.value.trim(),
    width: Number(adminWidth.value) || 450
  };
}

function renderAdminPreview() {
  adminImageFields.hidden = adminType.value !== "image";
  adminHtmlFields.hidden = adminType.value !== "html";

  const banner = readAdminBanner();
  adminPreview.innerHTML = !banner
    ? `<p class="banner-empty">Aucun bandeau.</p>`
    : buildBannerHtml(banner);
}

function fillAdminForm(companyId) {
  const banner = getBanner(companyId);
  const image = banner && banner.type === "image" ? banner : null;
  adminType.value = banner ? banner.type : "none";
  adminImageUrl.value = image ? image.imageUrl : "";
  adminLink.value = image ? image.link || "" : "";
  adminAlt.value = image ? image.alt || "" : "";
  adminWidth.value = image ? image.width || 450 : 450;
  adminHtml.value = banner && banner.type === "html" ? banner.html : "";
  renderAdminPreview();
}

function openAdmin() {
  adminCompany.value = bannerCompanySelect.value;
  fillAdminForm(adminCompany.value);
  try {
    const saved = localStorage.getItem(PASSWORD_STORAGE_KEY);
    adminPassword.value = saved || "";
    adminRemember.checked = Boolean(saved);
  } catch (err) {
    // Stockage indisponible : le mot de passe sera simplement redemandé.
  }
  if (BANNERS_API_URL) {
    setAdminStatus("");
    adminSave.disabled = false;
  } else {
    setAdminStatus("Édition en ligne non configurée (BANNERS_API_URL vide dans config.js).", "error");
    adminSave.disabled = true;
  }
  adminDialog.showModal();
}

async function saveAdminBanner(event) {
  event.preventDefault();
  if (!BANNERS_API_URL) return;

  const companyId = adminCompany.value;
  const password = adminPassword.value;
  if (!password) {
    setAdminStatus("Saisissez le mot de passe.", "error");
    adminPassword.focus();
    return;
  }

  adminSave.disabled = true;
  setAdminStatus("Enregistrement…");
  try {
    const res = await fetch(`${BANNERS_API_URL}/banners/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
      body: JSON.stringify(readAdminBanner())
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);

    remoteBanners = data;
    try {
      if (adminRemember.checked) localStorage.setItem(PASSWORD_STORAGE_KEY, password);
      else localStorage.removeItem(PASSWORD_STORAGE_KEY);
    } catch (err) {
      // Stockage indisponible : sans conséquence pour l'enregistrement.
    }
    bannerCompanySelect.value = companyId;
    renderBannerPreview();
    setAdminStatus("Bandeau enregistré. Il est visible par tous dès maintenant.", "success");
  } catch (err) {
    setAdminStatus(err instanceof TypeError ? "Serveur injoignable." : err.message, "error");
  } finally {
    adminSave.disabled = false;
  }
}

populateCompanies(adminCompany);
onTenClicks(document.getElementById("banner-tutorial-emoji"), openAdmin);
adminCompany.addEventListener("change", () => fillAdminForm(adminCompany.value));
[adminType, adminImageUrl, adminLink, adminAlt, adminWidth, adminHtml].forEach((el) => {
  el.addEventListener("input", renderAdminPreview);
});
adminForm.addEventListener("submit", saveAdminBanner);
document.getElementById("admin-close").addEventListener("click", () => adminDialog.close());

populateCompanies(companySelect);
populateCompanies(bannerCompanySelect);
renderPreview();
renderBannerPreview();
loadRemoteBanners();
