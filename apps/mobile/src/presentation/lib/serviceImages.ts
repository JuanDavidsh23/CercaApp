/**
 * Utilidad de presentación para mapear servicios y productos a imágenes de alta calidad.
 * Relaciona el título y la categoría del anuncio con imágenes de Unsplash estilizadas.
 */

interface ServiceImageCategory {
  keywords: readonly string[];
  url: string;
}

const SERVICE_CATEGORIES: readonly ServiceImageCategory[] = [
  {
    keywords: ["plomer", "tuber", "agua", "fuga", "grifo", "drenaje", "cañer"],
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["electr", "cable", "luz", "iluminac", "corto", "switch", "toma"],
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["limpie", "hogar", "aseo", "desinfec", "casa", "oficina", "desmancha"],
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["jardin", "poda", "planta", "grama", "pasto", "arbol"],
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["pintu", "pintar", "pared", "brocha", "rodillo", "fachada"],
    url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["carpin", "mader", "mueble", "puerta", "closet", "mesa"],
    url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["cerraj", "llave", "chapa", "candado", "cerradur"],
    url: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["mudan", "flete", "transpor", "acarreo", "carga"],
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["foto", "camara", "retrato", "evento", "estudio"],
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["diseñ", "logo", "brand", "ilustra", "grafic"],
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["peluquer", "barber", "corte", "cabello", "barba", "peinado"],
    url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["manicur", "uña", "pedicur", "gel", "acrilic"],
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["masaje", "spa", "relaj", "terapia", "corporal"],
    url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["entrena", "gym", "fit", "ejercic", "funcional", "personal"],
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["yoga", "medita", "pilates", "estira"],
    url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["nutri", "dieta", "alimenta", "saludable"],
    url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["pc", "computa", "laptop", "tecnolog", "hardwa", "softwa"],
    url: "https://images.unsplash.com/photo-1597872250970-45d259e89d1b?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["wifi", "red", "internet", "router", "modem"],
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["celular", "movil", "phone", "pantalla", "bateria"],
    url: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["aire", "acondicion", "clima", "refrigerac", "frio"],
    url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["fumiga", "plaga", "insecto", "cucarach", "roedor"],
    url: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["niñer", "cuidado", "niño", "bebe", "infan"],
    url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["adulto", "ancian", "abuelo", "asisten"],
    url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["perro", "mascota", "canino", "gato", "paseo"],
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["veterin", "vacuna", "salud animal"],
    url: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["cater", "comida", "banquete", "chef", "cocina"],
    url: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["reposter", "pastel", "torta", "postre", "galleta"],
    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["bartender", "trago", "coctel", "bar"],
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["dj", "musica", "fiesta", "sonido", "ilumina"],
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["guitarr", "musica", "canto", "piano", "viol"],
    url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["ingles", "idioma", "english", "traducc"],
    url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["matemat", "algebr", "calculo", "fisic", "tutor", "clase", "curso"],
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["contab", "finanz", "impuesto", "balan", "tribut"],
    url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["decorac", "decor", "adorno", "interior"],
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["costur", "confecc", "sastre", "ropa", "modist"],
    url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["tapicer", "retapiz", "sofa", "sill"],
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["vidri", "cristal", "ventana", "espejo"],
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["soldad", "metal", "herrer", "estructur"],
    url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["piso", "baldosa", "ceramica", "porcelan", "laminad"],
    url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800&auto=format&fit=crop",
  },
  {
    keywords: ["impermeab", "goter", "techo", "terraz"],
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
  },
];

const FALLBACK_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
];

/**
 * Retorna una URL de imagen representativa del servicio según su título o categoría.
 */
export function getServiceImageUrl(title: string, categoryName?: string): string {
  const normalizedTitle = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedCat = (categoryName ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const textToSearch = `${normalizedTitle} ${normalizedCat}`.toLowerCase();

  for (const cat of SERVICE_CATEGORIES) {
    if (cat.keywords.some((kw) => textToSearch.includes(kw))) {
      return cat.url;
    }
  }

  // Hash determinista si no hay coincidencia directa por palabra clave
  let hash = 0;
  for (let i = 0; i < textToSearch.length; i += 1) {
    hash = (hash << 5) - hash + textToSearch.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;
  const chosenFallback = FALLBACK_IMAGES[index];
  return (
    chosenFallback ??
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
  );
}
