'use client';

interface CondutorData {
  [key: string]: unknown;
}

interface LicencaPVCViewerProps {
  condutor: CondutorData;
}

export default function LicencaPVCViewer({ condutor }: LicencaPVCViewerProps) {
  const nome = (condutor.nomeCompleto as string) || '';
  const sexo = (condutor.sexo as string) || '';
  const membro = (condutor.numeroMembro as string) || '';
  const categoria = (condutor.tipoVeiculo as string) || '';
  const nacionalidade = (condutor.nacionalidade as string) || 'Angolana';
  const provincia = (condutor.provincia as string) || 'Lunda Sul';
  const dataEmissao = (condutor.dataEmissaoLicenca as string) || '';
  const validade = (condutor.validadeLicenca as string) || '';
  const numeroOrdem = (condutor.numeroOrdem as number) || 0;
  const foto = (condutor.fotoBase64 as string) || '';
  const qrCode = (condutor.qrCodeBase64 as string) || '';

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#1a1a1a',
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ============ FRENTE ============ */}
      <div>
        <p className="text-center text-sm font-medium text-[#6b6b6b] mb-3">FRENTE</p>
        <div
          className="pvc-card-front mx-auto"
          style={{
            width: '400px',
            height: '260px',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: '2px solid #1a1a1a',
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* === GREEN HEADER === */}
          <div
            style={{
              backgroundColor: '#1a5c2e',
              padding: '4px 16px 6px',
              textAlign: 'center',
              borderBottom: '2px solid #d4a017',
              flexShrink: 0,
            }}
          >
            <p style={{
              color: '#d4a017',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '2.5px',
              lineHeight: '1.15',
            }}>
              C.P.C.M.T.Q.L.S
            </p>
            <p style={{
              color: '#d4a017',
              fontSize: '6px',
              letterSpacing: '0.5px',
              lineHeight: '1.2',
              opacity: 0.9,
            }}>
              CONSELHO PROVINCIAL DOS CONDUTORES DE MOTOCICLOS, TRICICLOS E QUADRICICLOS DA LUNDA SUL
            </p>
            <div style={{ borderBottom: '1px solid #d4a017', paddingBottom: '3px', paddingTop: '1px' }}>
              <p style={{
                color: '#d4a017',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
              }}>
                LICENCA PROFISSIONAL DE CONDUTOR
              </p>
            </div>
          </div>

          {/* === CONTENT AREA === */}
          <div style={{ display: 'flex', padding: '8px 16px 4px', gap: '12px', flex: 1 }}>
            {/* Left: Data Fields */}
            <div style={{ flex: 1, fontSize: '10.5px', lineHeight: '1.6', color: '#1a1a1a' }}>
              <p><span style={labelStyle}>Nome:</span> {nome}</p>
              <p><span style={labelStyle}>Sexo:</span> {sexo}</p>
              <p style={{ fontSize: '8.5px', lineHeight: '1.4' }}>
                <span style={labelStyle}>Membro n</span>
                <span style={{ fontSize: '7px', verticalAlign: 'super' }}>o</span>
                <span style={labelStyle}>: C.P.C.M.T.Q.L.S</span>
              </p>
              <p style={{ fontSize: '9px' }}>
                <span style={labelStyle}>{membro}</span>
              </p>
              <p><span style={labelStyle}>Categoria:</span> {categoria}</p>
              <p><span style={labelStyle}>Titulo:</span> Condutor Profissional</p>
              <p><span style={labelStyle}>Nacionalidade:</span> {nacionalidade}</p>
              <p><span style={labelStyle}>Provincia:</span> {provincia}</p>
            </div>

            {/* Right: Photo + QR Code stacked */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flexShrink: 0,
            }}>
              {/* Photo */}
              <div style={{
                width: '88px',
                height: '100px',
                background: '#e8e8e3',
                border: '1.5px solid #1a1a1a',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {foto ? (
                  <img src={foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '9px', color: '#999' }}>FOTO</span>
                )}
              </div>
              {/* QR Code */}
              <div style={{
                width: '88px',
                height: '88px',
                background: 'white',
                border: '1px solid #d1d1cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}>
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '7px', color: '#bbb' }}>QR CODE</span>
                )}
              </div>
            </div>
          </div>

          {/* === SIGNATURE === */}
          <div style={{ textAlign: 'center', paddingBottom: '6px', paddingTop: '1px', flexShrink: 0 }}>
            <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '0.5px' }}>
              O DIRECTOR EXECUTIVO
            </p>
            <div style={{
              width: '120px',
              height: '1px',
              backgroundColor: '#1a1a1a',
              margin: '1px auto 0',
            }} />
          </div>
        </div>
      </div>

      {/* ============ TRAS ============ */}
      <div>
        <p className="text-center text-sm font-medium text-[#6b6b6b] mb-3">TRAS</p>
        <div
          className="pvc-card-back mx-auto"
          style={{
            width: '400px',
            height: '240px',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: '2px solid #1a1a1a',
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* === WHITE TOP SECTION (Dates + Barcode) === */}
          <div style={{ padding: '10px 16px 8px', flexShrink: 0 }}>
            {/* Dates row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '8px',
            }}>
              <span>Data de Emissao: {dataEmissao}</span>
              <span>Validade: {validade}</span>
            </div>

            {/* Barcode area */}
            <div style={{
              backgroundColor: '#1a1a1a',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
            }}>
              <span style={{
                color: 'white',
                fontSize: '8px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
              }}>
                CPCMTQLS-{String(numeroOrdem).padStart(6, '0')}-{condutor.numeroBI}
              </span>
            </div>
          </div>

          {/* === GREEN BOTTOM SECTION (Institutional) === */}
          <div
            style={{
              backgroundColor: '#1a5c2e',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '8px 16px',
            }}
          >
            {/* Institutional text - CENTERED */}
            <p style={{
              color: 'white',
              fontSize: '7.5px',
              lineHeight: '1.6',
              textAlign: 'center',
              marginBottom: '6px',
              padding: '0 10px',
            }}>
              Este passe e distribuido para o uso pessoal ao condutor profissional
              credenciado pelo Conselho Provincial da Lunda Sul. E intransferivel e
              deve-se acompanhar por um outro documento de Identificacao sempre que
              solicitado. Em caso de extravio, contactar a C.P.C.M.T.Q.L.S.
            </p>

            {/* Contacts */}
            <p style={{
              color: '#d4a017',
              fontSize: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '3px',
            }}>
              Contactos: 941-000-517 / 924-591-350
            </p>

            {/* Decree */}
            <p style={{
              color: 'white',
              fontSize: '7px',
              textAlign: 'center',
              marginBottom: '6px',
            }}>
              Decreto Presidencial N 245/15
            </p>

            {/* Bottom row: Lunda Sul image (left) + Slogan + Angola image (right) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '6px',
              gap: '6px',
            }}>
              {/* Lunda Sul image (LEFT) */}
              <img
                src="/lunda-sul-provincia.png"
                alt="Lunda Sul"
                style={{
                  height: '30px',
                  width: 'auto',
                  flexShrink: 0,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
                }}
              />

              {/* Slogan */}
              <p style={{
                color: 'white',
                fontSize: '8px',
                fontStyle: 'italic',
                textAlign: 'center',
                flex: 1,
              }}>
                &quot;Mototaxistas organizados, transito mais seguro&quot;
              </p>

              {/* Angola flag image (RIGHT) */}
              <img
                src="/bandeira-angola.png"
                alt="Bandeira de Angola"
                style={{
                  height: '30px',
                  width: 'auto',
                  flexShrink: 0,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
