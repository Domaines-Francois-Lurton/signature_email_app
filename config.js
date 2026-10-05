// Configuration des sociétés.
const COMPANIES = [
  {
    id: "fl",
    name: "François Lurton",
    website: "https://www.domainesfrancoislurton.com/",
    logoUrl: "https://i.ibb.co/spJz2Kc2/LOGO-FL.png",
    logoAlt: "François Lurton",
    logoWidth: 120,
    address: "S.A François Lurton - Domaine de Poumeyrade - 33870 Vayres - France"
  },
  {
    id: "vec",
    name: "Vayres Embouteillage et Conditionnement",
    website: "https://www.vec33.com/",
    logoUrl: "https://i.ibb.co/FbdRKG3H/LOGO-VEC.png",
    logoAlt: "VEC",
    logoWidth: 120,
    address: "S.A.R.L VEC - Domaine de Poumeyrade - 33870 Vayres - France"
  },
  {
    id: "pardela",
    name: "Pardela Wines",
    website: "https://www.pardelawines.com/",
    logoUrl: "https://i.ibb.co/FLDy46KC/LOGO-PARDELA-WINE.png",
    logoAlt: "Pardela Wines",
    logoWidth: 120,
    address: "S.A.S. Pardela Wines - Domaine de Poumeyrade - 33870 Vayres - France"
  }
];

// Adresse du Worker Cloudflare qui stocke les bandeaux (voir worker/README.md).
// Vide = les bandeaux ci-dessous sont utilisés et l'édition en ligne est désactivée.
const BANNERS_API_URL = "https://bandeaux-email.yvain-ramousse.workers.dev";

// Bandeaux par défaut, un par société (clé = id de la société).
// Utilisés si le Worker n'est pas configuré ou ne répond pas ; sinon, les
// bandeaux enregistrés depuis l'interface les remplacent. Deux formats possibles :
//   { type: "image", imageUrl: "https://…", link: "https://…" (optionnel), alt: "…", width: 450 }
//   { type: "html", html: `<table>…</table>` }
// Mettre null pour une société sans bandeau en ce moment.
// ⚠️ Exemples à remplacer par les vrais visuels.
const BANNERS = {
  fl: {
    type: "image",
    imageUrl: "https://placehold.co/450x100/171717/ffffff/png?text=Bandeau+Fran%C3%A7ois+Lurton",
    link: "https://www.domainesfrancoislurton.com/",
    alt: "François Lurton",
    width: 450
  },
  vec: null,
  pardela: {
    type: "html",
    html: `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 450px;">
  <tr>
    <td align="center" style="background-color: #7a1f2b; padding: 14px 20px; font-family: Arial, sans-serif; font-size: 13px; color: #ffffff; text-align: center;">
      Découvrez nos nouveaux millésimes —
      <a href="https://www.pardelawines.com/" target="_blank" style="color: #ffffff; font-weight: 700; text-decoration: underline;">pardelawines.com</a>
    </td>
  </tr>
</table>`
  }
};
