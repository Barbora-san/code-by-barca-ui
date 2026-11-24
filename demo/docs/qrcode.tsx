import { QRCode } from "../../src";
import { Col, Row } from "../ui";
import type { Doc } from "./types";

function QRCodeDemo() {
  return (
    <Col gap={16}>
      <Row gap={24} align="center">
        <QRCode
          value="https://code-by-barca.cz"
          size={180}
          ariaLabel="QR kód webu Code by Barca"
        />
        <div>
          <strong>Code by Barca</strong>
          <p className="demo-muted">Naskenovatelný QR kód s odkazem na web.</p>
        </div>
      </Row>
      <Row gap={16} align="center">
        <QRCode value="https://code-by-barca.cz" size={128} level="H" />
        <QRCode value="https://code-by-barca.cz" size={128} fgColor="#e8803a" bgColor="#0a0a0a" />
      </Row>
    </Col>
  );
}

export const QRCODE_DOCS: Doc[] = [
  {
    id: "qrcode",
    name: "QRCode",
    desc: "Skutečný skenovatelný QR kód vykreslený jako SVG. Podporuje velikost, korekci chyb, tichou zónu, barvy a přístupný popis. Hodí se pro odkazy, vstupenky i krátkodobé TOTP provisioning URI.",
    props: ["QRCode"],
    preview: <QRCodeDemo />,
    code: `import { QRCode } from "code-by-barca-ui";

// Běžný odkaz
<QRCode value="https://example.com" size={220} />

// TOTP registrace – provisioning URI zobraz jen během enrolmentu
<QRCode
  value={provisioningUri}
  size={220}
  level="M"
  includeMargin
  ariaLabel="QR kód pro autentizační aplikaci"
/>

// Vlastní barvy a vyšší korekce chyb
<QRCode value={payload} fgColor="#e8803a" bgColor="#0a0a0a" level="H" />`,
    note: <>Komponenta hodnotu neukládá ani neloguje. Pokud obsahuje TOTP secret nebo jiný citlivý údaj, neposílej ji do analytiky, logů ani trvalého úložiště a po dokončení registrace ji odstraň ze stavu aplikace.</>,
  },
];
