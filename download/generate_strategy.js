const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  LevelFormat, TableOfContents,
} = require("docx");
const fs = require("fs");

// ── Palette: GO-1 Graphite Orange (Proposal) ──
const P = {
  bg: "1A2330",
  primary: "FFFFFF",
  accent: "D4875A",
  table: { headerBg: "D4875A", headerText: "FFFFFF", accentLine: "D4875A", innerLine: "DDD0C8", surface: "F8F0EB" },
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
};

const c = (hex) => hex.replace("#", "");
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── Helper: Title calculation for cover ──
function calcTitleLayout(title, maxWidthTwips, preferredPt = 36, minPt = 24) {
  const charWidth = (pt) => pt * 20;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([
    ...' \t', ',', '.', ';', ':', '!', '?',
    ...'-_--/',  // connectors
  ]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) {
        breakAt = i; break;
      }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

// ── Build Cover (R1 Pure Paragraph Left, dark bg) ──
function buildCover() {
  const title = "Plan Estrategico: Lanzamiento del Token $MUNDIAL en Solana";
  const subtitle = "Estrategia de marketing y atraccion de inversores sin presupuesto";
  const { titlePt, titleLines } = calcTitleLayout(title, 9500, 36, 26);

  const titleParagraphs = titleLines.map((line, idx) =>
    new Paragraph({
      spacing: { before: idx === 0 ? 0 : 60, after: 60, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: line,
          bold: true,
          size: titlePt * 2,
          color: P.cover.titleColor,
          font: { ascii: "Times New Roman", eastAsia: "SimHei" },
        }),
      ],
    })
  );

  return [
    new Paragraph({ spacing: { before: 3600 }, children: [] }),
    ...titleParagraphs,
    new Paragraph({
      spacing: { before: 200, after: 100, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: subtitle,
          size: 22,
          color: P.cover.subtitleColor,
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 1200 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Plataforma: pump.fun  |  Red: Solana  |  Presupuesto: 1 SOL",
          size: 20,
          color: P.cover.metaColor,
          font: { ascii: "Calibri" },
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 200 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Junio 2026",
          size: 20,
          color: P.cover.metaColor,
          font: { ascii: "Calibri" },
        }),
      ],
    }),
  ];
}

// ── Helper functions for body ──
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: "1A2330", font: { ascii: "Times New Roman" } })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: "1A2330", font: { ascii: "Times New Roman" } })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, color: "1A2330", font: { ascii: "Times New Roman" } })],
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: "1A1A1A", font: { ascii: "Calibri" } })],
  });
}

function bodyBold(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: "1A1A1A", font: { ascii: "Calibri" }, bold: true })],
  });
}

function emptyPara() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [] });
}

// ── Table helper ──
function makeTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(text =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 21, color: P.table.headerText, font: { ascii: "Calibri" } })],
        })],
        shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
      })
    ),
  });

  const dataRows = rows.map((row, idx) =>
    new TableRow({
      cantSplit: true,
      children: row.map(text =>
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text, size: 21, color: "1A1A1A", font: { ascii: "Calibri" } })],
          })],
          shading: idx % 2 === 0
            ? { type: ShadingType.CLEAR, fill: P.table.surface }
            : { type: ShadingType.CLEAR, fill: "FFFFFF" },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
        })
      ),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...dataRows],
  });
}

// ══════════════════════════════════════════
// BUILD DOCUMENT
// ══════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" },
          size: 24,
          color: "1A1A1A",
        },
        paragraph: {
          spacing: { line: 312 },
        },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: "1A2330" },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: "1A2330" },
        paragraph: { spacing: { before: 280, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 24, bold: true, color: "1A2330" },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  numbering: {
    config: [
      {
        reference: "list-steps",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "list-phases",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "list-website",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "list-social",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "list-risks",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // ── SECTION 1: Cover ──
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [
        new Table({
          borders: allNoBorders,
          rows: [
            new TableRow({
              height: { value: 16838, rule: "exact" },
              children: [
                new TableCell({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.bg },
                  borders: allNoBorders,
                  children: buildCover(),
                }),
              ],
            }),
          ],
        }),
      ],
    },

    // ── SECTION 2: TOC ──
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
          })],
        }),
      },
      children: [
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Contenido", bold: true, size: 36, color: "1A2330", font: { ascii: "Times New Roman" } })],
        }),
        new TableOfContents("Tabla de Contenido", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [
            new TextRun({
              text: "Nota: Haga clic derecho sobre la tabla de contenido y seleccione 'Actualizar campo' para refrescar los numeros de pagina.",
              size: 18,
              italics: true,
              color: "808080",
              font: { ascii: "Calibri" },
            }),
          ],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },

    // ── SECTION 3: Body ──
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Plan Estrategico $MUNDIAL", size: 18, color: "808080", font: { ascii: "Calibri" } })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
          })],
        }),
      },
      children: [
        // ── 1. RESUMEN EJECUTIVO ──
        h1("1. Resumen Ejecutivo"),
        body("El presente documento establece la estrategia completa para el lanzamiento del token $MUNDIAL en la red blockchain de Solana, utilizando la plataforma pump.fun como punto de acceso principal al mercado de memecoins. El objetivo central es crear un token tematico vinculado a la celebracion del Mundial de Futbol que genere interes organico, atraiendo inversores sin necesidad de un presupuesto significativo de marketing."),
        body("La estrategia se fundamenta en tres pilares: la diferenciacion del nombre 'MUNDIAL' frente a la saturacion de tokens con el nombre 'Worldcup', la creacion de una web interactiva que genere trafico organico y comunidad desde el dia cero, y el aprovechamiento maximalista de las herramientas gratuitas que ofrece pump.fun y el ecosistema de Solana para ganar visibilidad sin inversion economica adicional."),
        body("El presupuesto total inicial es de 1 SOL destinado exclusivamente al pool de liquidez en pump.fun. Toda la estrategia de marketing, creacion de contenido y promocion se ejecutara mediante metodos organicos en redes sociales, optimizacion dentro de la propia plataforma y el efecto viral que puede generar una identidad de marca bien construida alrededor de la pasion futbolistica mundial."),

        // ── 2. CONTEXTO Y ANTECEDENTES ──
        h1("2. Contexto y Antecedentes"),
        h2("2.1 El ecosistema Solana y pump.fun"),
        body("Solana se ha consolidado como una de las blockchain lideres para el mercado de memecoins y tokens de baja capitalizacion. Su alta velocidad de transacciones, comisiones extremadamente bajas y ecosistema de DeFi maduro la convierten en el terreno ideal para proyectos que buscan un lanzamiento rapido y accesible. Dentro de este ecosistema, pump.fun ha emergido como la plataforma predominante para el lanzamiento de nuevos tokens, funcionando como un incubador de proyectos cripto que permite a cualquier persona crear un token con una inversion minima."),
        body("pump.fun opera bajo un modelo de fair launch donde el creador deposita una cantidad inicial de SOL para establecer liquidez, y los primeros compradores determinan el precio del token mediante mecanismos de bonding curve. Una vez que el token alcanza una capitalizacion de mercado predeterminada, se crea automaticamente un pool de liquidez en Raydium, uno de los principales DEX de Solana, lo que permite trading continuo y liquidez mas profunda. Este modelo democratiza el acceso a la creacion de tokens y ha dado origen a multiples proyectos que alcanzaron retornos excepcionales."),
        body("El volumen diario en pump.fun supera regularmente millones de dolares en transacciones, lo que significa que hay miles de inversores activos buscando el proximo token con potencial. La competencia es intensa, pero tambien lo es la oportunidad: tokens bien posicionados tematicamente y con una comunidad activa pueden captar atencion rapidamente en este entorno de alto volumen."),

        h2("2.2 La oportunidad del Mundial de Futbol"),
        body("Los eventos deportivos mundiales, y especialmente el Mundial de Futbol, representan una de las mayores fuentes de atencion global. Miles de millones de personas siguen el torneo, lo que genera un volumen masivo de conversaciones en redes sociales, contenido viral y participacion emocional. Esta atencion traducida al mundo cripto ha demostrado ser un catalizador poderoso para el rendimiento de tokens tematicos."),
        body("Historicamente, los tokens vinculados a eventos deportivos masivos experimentan picos de interes significativos durante las fases previas y durante el evento. La clave del exito no reside unicamente en la tematica, sino en la capacidad del proyecto para captar esa atencion masiva y convertirla en una comunidad de inversores activos. Los tokens que logran crear una narrativa atractiva y una identidad memorable tienen mayor probabilidad de sostener el interes mas alla del evento mismo."),

        // ── 3. ANALISIS DE NOMBRE DEL TOKEN ──
        h1("3. Analisis de Nombre del Token"),
        h2("3.1 Comparativa: MUNDIAL vs WORLDCUP"),
        body("La eleccion del nombre del token es una decision estrategica fundamental que afecta directamente la diferenciacion, la memorableidad y la capacidad de captar atencion en un mercado saturado. A continuacion se presenta un analisis detallado de ambas opciones, evaluando factores criticos que determinaran el exito del proyecto."),

        makeTable(
          ["Criterio", "MUNDIAL", "WORLDCUP"],
          [
            ["Diferenciacion", "Alta - muy pocos tokens con este nombre", "Baja - saturacion extrema del nombre"],
            ["Reconocimiento global", "Muy alto - palabra universal en espanol, portugues y otros idiomas", "Alto - termino estandar en ingles"],
            ["Emocion cultural", "Extrema - evoca pasion futbolistica en Latinoamerica, Europa y Africa", "Moderada - mas tecnico/descriptivo"],
            ["SEO / Busquedas", "Favorable - menos competencia en resultados", "Competitivo - miles de resultados existentes"],
            ["Comunidad potencial", "Mercado hispanohablante + lusohablante = 800M+ personas", "Mercado angloparlante = 1.5B personas (pero saturado)"],
            ["Identidad cripto", "Unico y memorable - facil de recordar", "Generico - se confunde con otros tokens"],
            ["Tendencia actual", "Casi sin competencia en pump.fun", "Multiples tokens activos con el mismo nombre"],
          ]
        ),
        emptyPara(),

        h2("3.2 Recomendacion estrategica: $MUNDIAL"),
        body("La recomendacion definitiva es utilizar el symbol MUNDIAL por multiples razones estrategicas de alto impacto. Primero, la casi nula competencia existente con este nombre en pump.fun significa que cualquier busqueda o mencion del token sera inmediatamente asociada con nuestro proyecto, eliminando la confusion que genera la saturacion del nombre Worldcup. En un mercado donde cientos de tokens compiten por atencion, la diferenciacion es el activo mas valioso."),
        body("Segundo, la palabra 'Mundial' carga una fuerte carga emocional que trasciende las fronteras linguisticas. Aunque es especialmente poderosa en el mundo hispanohablante y lusohablante, su significado es universalmente comprendido. El termino evoca directamente la emocion, la pasion y el sentido de pertenencia que genera el torneo deportivo mas grande del planeta. Esta conexion emocional es precisamente lo que impulsa el comportamiento de inversion en el mercado de memecoins: las personas invierten en lo que les genera una respuesta emocional positiva."),
        body("Tercero, el mercado hispanohablante y lusohablante representa una audiencia combinada de mas de 800 millones de personas, muchas de las cuales tienen una conexion profunda con el futbol. Esta es una audiencia masiva y relativamente menos explotada en el espacio cripto comparada con el mercado angloparlante. Al orientar el token hacia esta comunidad, se accede a un segmento con alta afinidad tematica y menor ruido competitivo."),

        // ── 4. GUIA DE LANZAMIENTO EN PUMP.FUN ──
        h1("4. Guia de Lanzamiento en pump.fun"),
        h2("4.1 Requisitos previos"),
        body("Antes de proceder al lanzamiento, es fundamental preparar el entorno adecuado. Se necesita una wallet de Solana con al menos 1.2 SOL (1 SOL para el pool de liquidez y 0.2 SOL como margen para gas fees y transacciones). La wallet recomendada es Phantom o Solflare, ambas disponibles como extension de navegador y aplicacion movil. Es crucial asegurarse de tener la version mas actualizada de la wallet y guardar las frases de recuperacion en un lugar seguro."),

        h2("4.2 Proceso paso a paso"),
        body("A continuacion se detalla el proceso completo para lanzar el token en pump.fun, desde la creacion hasta la optimizacion post-lanzamiento:"),

        makeTable(
          ["Paso", "Accion", "Detalle"],
          [
            ["1", "Conectar wallet", "Acceder a pump.fun y conectar la wallet de Solana (Phantom/Solflare)"],
            ["2", "Crear el token", "Hacer clic en 'Create a coin'. Configurar: Name = 'Mundial', Symbol = 'MUNDIAL', Description = texto atractivo vinculado al futbol mundial",],
            ["3", "Subir imagen", "Seleccionar una imagen de perfil llamativa. Recomendacion: un diseno que combine futbol con elementos cripto, colores vibrantes. Tamano 300x300px minimo",],
            ["4", "Iniciar el pool", "Depositar 1 SOL para crear el bonding curve pool. pump.fun creara automaticamente la supply total del token y el mecanismo de precio",],
            ["5", "Compartir enlace", "Una vez creado, pump.fun genera un enlace unico para el token. Este enlace es fundamental para toda la promocion",],
            ["6", "Monitorear progresos", "Seguir el progreso del bonding curve en el dashboard de pump.fun. Cuando alcance la capitalizacion objetivo, se migrara a Raydium",],
            ["7", "Promocion activa", "Comenzar inmediatamente la campana de marketing organico mientras el token esta en su fase de bonding curve",],
          ]
        ),
        emptyPara(),

        h2("4.3 Configuracion optima del token"),
        body("La configuracion del token en pump.fun debe optimizarse para maximizar el atractivo. El nombre debe ser 'Mundial' y el symbol 'MUNDIAL' para mantener consistencia en todas las plataformas. La descripcion debe ser concisa pero emocionalmente resonante, idealmente una frase que capture la esencia del proyecto y motive a los inversores a investigar mas. Se recomienda incluir un enlace a la web interactiva en la descripcion, ya que pump.fun permite incluir links."),

        // ── 5. ESTRATEGIA DE MARKETING SIN PRESUPUESTO ──
        h1("5. Estrategia de Marketing Sin Presupuesto"),
        h2("5.1 Filosofia de la estrategia"),
        body("La ausencia de presupuesto financiero no significa ausencia de recursos. En el ecosistema cripto, los recursos mas valiosos son la creatividad, la consistencia, la comunidad y el timing. La estrategia que presentamos se basa en capitalizar estos recursos para generar un efecto organico de crecimiento. Cada accion esta disenada para multiplicar su impacto a traves del efecto red de las redes sociales y las dinamicas comunitarias de pump.fun."),
        body("El principio fundamental es crear contenido que las personas quieran compartir voluntariamente. Esto se logra mediante humor, emocion, utilidad o exclusividad. El token $MUNDIAL tiene una ventaja natural: el futbol es el tema mas compartido en redes sociales a nivel mundial, lo que significa que hay una audiencia pre-calentada y receptiva a contenido relacionado."),

        h2("5.2 Fase 1: Pre-lanzamiento (Dias -7 a 0)"),
        h3("5.2.1 Creacion de identidad visual"),
        body("Antes de lanzar el token, es imperativo tener una identidad visual coherente y profesional. Esto incluye el logo del token, una paleta de colores consistente, plantillas para publicaciones en redes sociales y un estilo visual que sea inmediatamente reconocible. La identidad debe transmitir energia futbolistica, modernidad cripto y accesibilidad. Se recomienda utilizar herramientas gratuitas como Canva para el diseno, GIMP para edicion avanzada, y coolors.co para la generacion de paletas de colores."),
        h3("5.2.2 Configuracion de redes sociales"),
        body("Crear perfiles en X (Twitter), Telegram y Discord como los canales principales. En X, el perfil debe tener el logo del token como foto de perfil, un banner atractivo que combine futbol y cripto, y una biografia clara que comunique de que trata el proyecto. En Telegram, crear un grupo publico para la comunidad y un canal de anuncios. En Discord, configurar un servidor con canales basicos de bienvenida, general, memes, trading y sugerencias. Todas las redes deben apuntar al mismo enlace de pump.fun y a la web interactiva."),

        h2("5.3 Fase 2: Lanzamiento y primera semana (Dias 0 a 7)"),
        h3("5.3.1 Activacion en pump.fun"),
        body("Inmediatamente despues del lanzamiento, la prioridad es generar actividad visible dentro de pump.fun. Esto implica comentar en otros tokens populares dentro de la plataforma de manera genuina y no spam, participando en la conversacion del ecosistema. Los primeros compradores son criticos: cada compra incrementa el precio y el grafico de pump.fun muestra la progresion, lo que atrae a mas inversores. La primera meta es alcanzar la capitalizacion necesaria para la migracion a Raydium, que actualmente es de aproximadamente 69,000 USD en market cap."),
        h3("5.3.2 Contenido viral en X (Twitter)"),
        body("X es la red social mas importante para el ecosistema cripto. La estrategia de contenido debe incluir hilos educativos sobre el proyecto, memes de alta calidad vinculando futbol y cripto con el token $MUNDIAL, encuestas interactivas sobre predicciones futbolisticas, graficos de rendimiento del token con narrativa emocional, y respuestas estrategicas a publicaciones de cuentas influyentes del mundo cripto y futbolistico. La frecuencia recomendada es de 8-12 publicaciones diarias durante la primera semana, reduciendo gradualmente a 4-6 diarias en las semanas siguientes."),
        h3("5.3.3 Growth de la comunidad en Telegram y Discord"),
        body("Telegram y Discord son los canales donde se construye la comunidad leal. La estrategia incluye la creacion de eventos diarios como predicciones de partidos, sorteos de tokens entre los primeros miembros, sesiones de preguntas y respuestas con los fundadores, y un sistema de roles para los miembros mas activos. El objetivo es pasar de 0 a 500 miembros activos en Telegram durante la primera semana. Para Discord, se busca alcanzar 200 miembros activos con participacion constante en los canales."),

        h2("5.4 Fase 3: Expansion y sostenibilidad (Dias 7 a 30)"),
        h3("5.4.1 Colaboraciones y partnerships"),
        body("Sin presupuesto, las colaboraciones se basan en el intercambio de valor mutuo. Esto incluye cross-promotions con otros tokens de Solana que no sean competidores directos, alianzas con creadores de contenido futbolistico en redes, participacion en spaces de X y podcasts cripto como invitado, y la creacion de un programa de embajadores donde los miembros mas activos de la comunidad reciben un rol especial y son recompensados con airdrops de tokens por su contribucion a la promocion organica."),
        h3("5.4.2 Contenido de valor sostenible"),
        body("Mas alla de los memes y la promocion directa, es necesario crear contenido que aporte valor a la audiencia futbolistica y cripto. Esto incluye analisis de partidos con una perspectiva cripto, guias educativas sobre como usar Solana y pump.fun para nuevos inversores, resumenes semanales del rendimiento del token, y contenido interactivo como juegos de pronosticos con recompensas en $MUNDIAL. Este tipo de contenido posiciona al proyecto como algo mas que un simple memecoin y construye lealtad a largo plazo."),

        // ── 6. CONCEPTO DE WEB INTERACTIVA ──
        h1("6. Concepto de Web Interactiva"),
        h2("6.1 Propuesta central: Mundial Predict"),
        body("La propuesta para la web interactiva es 'Mundial Predict', una plataforma web gratuita donde los usuarios pueden hacer predicciones sobre partidos del Mundial de Futbol y ganar puntos que pueden canjear por tokens $MUNDIAL. La idea es crear una experiencia gamificada que sea viral por naturaleza: los usuarios compiten entre ellos, comparten sus predicciones en redes sociales, y son recompensados con tokens por su participacion y precision."),
        body("La web no requiere inversion significativa para ser construida. Puede desarrollarse con herramientas como Next.js o incluso con plataformas de low-code como Vercel, desplegada gratuitamente. La funcionalidad central es simple: un sistema de prediccion por partidos, una tabla de clasificacion publica, y un mecanismo de verificacion de wallet de Solana para distribuir las recompensas en tokens."),

        h2("6.2 Funcionalidades principales"),
        makeTable(
          ["Funcionalidad", "Descripcion", "Proposito estrategico"],
          [
            ["Predicciones de partidos", "Los usuarios predicen resultado, goleador y minuto del primer gol", "Engagement diario y motivo para volver a la web"],
            ["Tabla de clasificacion", "Ranking publico de los mejores predictores con puntos acumulados", "Competencia y gamificacion que genera viralidad"],
            ["Wallet Connect", "Conexion de wallet Solana para reclamar recompensas en $MUNDIAL", "Convierte visitantes en holders del token"],
            ["Compartir en redes", "Botones para compartir predicciones y posicion en X, Telegram, etc.", "Marketing organico gratuito por cada usuario"],
            ["Misiones diarias", "Misiones simples que otorgan puntos extra (invitar amigos, etc.)", "Growth organico de la base de usuarios"],
            ["Widget de pump.fun", "Integracion del precio actual de $MUNDIAL y enlace de compra", "Convierte el trafico de la web en compras del token"],
          ]
        ),
        emptyPara(),

        h2("6.3 Flujo de conversion: de visitante a inversor"),
        body("El objetivo principal de la web es funcionar como un embudo de conversion que transforma visitantes casuales en inversores de $MUNDIAL. El flujo disenado es el siguiente: un usuario llega a la web atraido por una prediccion compartida en redes sociales. Se registra para participar en las predicciones. Juega, gana puntos y sube en la tabla de clasificacion. Para reclamar sus recompensas en tokens, debe conectar su wallet de Solana. En ese momento, ve el widget de pump.fun con el precio actual y el enlace de compra. La combinacion de recompensas gratis y la facilidad de compra en un solo click convierte una porcion significativa de estos visitantes en holders del token."),
        body("Este modelo es autosostenible porque cada nuevo usuario que comparte sus predicciones atrae a mas usuarios, creando un ciclo virtuoso de crecimiento organico. La web se promociona a si misma a traves del comportamiento natural de sus usuarios, eliminando la necesidad de inversion publicitaria continua."),

        // ── 7. HOJA DE RUTA DE IMPLEMENTACION ──
        h1("7. Hoja de Ruta de Implementacion"),
        h2("7.1 Cronograma general"),
        body("La implementacion se estructura en un cronograma de 30 dias que cubre desde la preparacion hasta la fase de expansion. Cada fase tiene entregables especificos y metas medibles que permiten evaluar el progreso y ajustar la estrategia en tiempo real."),

        makeTable(
          ["Fase", "Periodo", "Entregables clave", "Meta principal"],
          [
            ["Pre-lanzamiento", "Dias -7 a 0", "Identidad visual, redes sociales configuradas, web MVP desplegada", "Infraestructura lista para el lanzamiento"],
            ["Lanzamiento", "Dia 0", "Token vivo en pump.fun, pool de liquidez activo, primera publicacion en X", "Primeras 50 compras del token"],
            ["Primera semana", "Dias 1 a 7", "Contenido viral activo, comunidad en Telegram 500+, web generando trafico", "Migracion a Raydium (69K market cap)"],
            ["Expansion", "Dias 7 a 30", "Colaboraciones activas, contenido de valor, programa de embajadores", "1,000+ holders, comunidad 2,000+ miembros"],
          ]
        ),
        emptyPara(),

        h2("7.2 Checklist de pre-lanzamiento"),
        body("Antes de ejecutar el lanzamiento, se debe verificar que cada uno de los siguientes elementos este completo y funcionando. Esta lista es no negociable y debe revisarse al menos 24 horas antes del lanzamiento planificado:"),

        makeTable(
          ["Item", "Estado", "Responsable"],
          [
            ["Wallet de Solana con 1.2 SOL", "Pendiente", "Fundador"],
            ["Cuenta de X configurada con identidad visual", "Pendiente", "Marketing"],
            ["Grupo de Telegram creado (minimo 10 seed members)", "Pendiente", "Comunidad"],
            ["Servidor de Discord configurado con canales basicos", "Pendiente", "Comunidad"],
            ["Logo y avatar del token finalizado", "Pendiente", "Diseno"],
            ["Descripcion del token redactada y optimizada", "Pendiente", "Marketing"],
            ["Web interactiva MVP desplegada en produccion", "Pendiente", "Desarrollo"],
            ["Imagen del token subida y optimizada (300x300px)", "Pendiente", "Diseno"],
            ["Guiones de las primeras 20 publicaciones en X preparados", "Pendiente", "Marketing"],
            ["Documento de respuesta a preguntas frecuentes", "Pendiente", "Fundador"],
          ]
        ),
        emptyPara(),

        // ── 8. ANALISIS DE RIESGOS ──
        h1("8. Analisis de Riesgos"),
        body("Todo proyecto cripto conlleva riesgos inherentes que deben identificarse, evaluarse y mitigarse proactivamente. A continuacion se presenta el analisis de los principales riesgos asociados al lanzamiento de $MUNDIAL y las estrategias de mitigacion correspondientes para cada uno."),

        makeTable(
          ["Riesgo", "Probabilidad", "Impacto", "Mitigacion"],
          [
            ["Baja liquidez inicial (token no despega)", "Media", "Alto", "Concentrar esfuerzos de marketing en primeras 48 horas; generar FOMO con conteos regresivos en X"],
            ["Competencia de otros tokens futbolisticos", "Alta", "Medio", "Diferenciarse con 'Mundial' en vez de 'Worldcup'; enfocar en la comunidad hispanohablante"],
            ["Acusaciones de rug pull o scam", "Media", "Critico", "Transparencia total: publicar wallet del dev, mostrar plan de tokenomics, no vender tokens iniciales"],
            ["Dependencia de un solo evento temporal", "Alta", "Alto", "Disenar utilidad mas alla del Mundial: predicciones de ligas locales, Champions, etc."],
            ["Saturacion del mercado de memecoins", "Media", "Medio", "Enfocarse en la narrativa unica y la comunidad; el token debe tener proposito mas alla del meme"],
            ["Hackeo o exploit tecnico", "Baja", "Critico", "Usar contratos auditados de pump.fun; no desarrollar smart contracts propios en esta fase"],
            ["Regulacion cambiante en criptomonedas", "Baja", "Medio", "Mantenerse informado; operar bajo las normas actuales de Solana y pump.fun"],
            ["Fatiga de la comunidad post-evento", "Media", "Alto", "Planificar contenido y utilidad continua que trascienda el Mundial"],
          ]
        ),
        emptyPara(),

        // ── 9. BENEFICIOS ESPERADOS Y PROXIMOS PASOS ──
        h1("9. Beneficios Esperados y Proximos Pasos"),
        h2("9.1 Beneficios proyectados"),
        body("Si la estrategia se ejecuta de manera consistente y disciplinada, los beneficios esperados se pueden categorizar en tres dimensiones principales. En la dimension financiera, el objetivo es alcanzar una capitalizacion de mercado de 100,000 USD en los primeros 30 dias, lo que representaria un retorno significativo sobre la inversion inicial de 1 SOL. Este objetivo es ambicioso pero alcanzable considerando el volumen diario en pump.fun y la potencia de la tematica futbolistica mundial."),
        body("En la dimension comunitaria, la meta es construir una base de 2,000 miembros activos entre Telegram y Discord, y 1,000 holders del token. Esta comunidad no solo sostiene la liquidez del token sino que genera contenido organico que amplifica el alcance del proyecto sin costo adicional. Una comunidad activa es el activo mas duradero de cualquier proyecto cripto y la base para futuras iniciativas."),
        body("En la dimension estrategica, el proyecto posiciona a los fundadores como referentes en el nicho de tokens deportivos en Solana, abriendo oportunidades para futuros proyectos, colaboraciones y desarrollo de productos mas complejos. La experiencia y los contactos adquiridos durante este proceso tienen un valor estrategico que trasciende el rendimiento financiero inmediato del token."),

        h2("9.2 Proximos pasos inmediatos"),
        body("Para ejecutar esta estrategia, el primer paso es designar las responsabilidades dentro del equipo fundador. Se recomienda dividir las funciones en tres roles principales: Deseno y Marca (responsable de la identidad visual y los contenidos graficos), Marketing y Comunidad (responsable de las redes sociales, las publicaciones y el growth de la comunidad), y Tecnologia (responsable del desarrollo y despliegue de la web interactiva). Si el equipo es reducido, una persona puede asumir multiples roles."),
        body("El segundo paso es iniciar el desarrollo de la web interactiva 'Mundial Predict' como prioridad absoluta, ya que es el elemento diferenciador principal de la estrategia y el motor de conversion de visitantes a inversores. El tercero es preparar toda la identidad visual y los materiales de lanzamiento, incluyendo al menos 20 publicaciones programadas para X. El cuarto paso es ejecutar el lanzamiento en pump.fun una vez que todos los elementos esten listos, priorizando la calidad de la ejecucion sobre la velocidad."),
        body("Esta estrategia no es una garantia de exito financiero, pero maximiza las probabilidades de captar atencion, construir comunidad y crear valor en un entorno de alta competencia con recursos limitados. La clave esta en la ejecucion consistente, la creatividad en el contenido y la autenticidad en la construccion de la comunidad."),
      ],
    },
  ],
});

// ── Generate ──
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/Plan_Estrategico_MUNDIAL_Solana.docx", buf);
  console.log("Document generated successfully!");
});
