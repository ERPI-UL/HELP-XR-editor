import { jsPDF } from "jspdf";
import { VanillaQR } from '../QRCode/VanillaQR.js';

const color = '#3730a3';
const logo = new Image();

export function printArtifactAnchor(artifact) {
    createDoc(artifact.id, artifact.name, "Artifact");
}

export function printWorkplaceAnchor(workplace) {
    createDoc(workplace.id, workplace.name, "Workplace");
}

function createPDFImage(id, name, qrType, dims) {
    const canvas = document.createElement("canvas");
    
    const ctx = canvas.getContext("2d");
    canvas.width = dims.x;
    canvas.height = dims.y;
    canvas.style.width = dims.x + "px";
    canvas.style.height = dims.y + "px";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // size in cm
    const pageSize = {x: 21, y: 29.7};
    const pageCenter = {x: pageSize.x / 2, y: pageSize.y / 2};
    const qrCodeBorderSize = 1;
    const frameSize = .5; 
    const frameRadius = 0.5;
    const qrCodeSize = 8;
    const textSize = 1;
    const textBorder = 0.5;
    const headerSize = 1;
    const headerBorder = 0.5;
    const logoSize = 1;
    const logoBorder = 0.5;
    
    // draw colored frame
    const cm2px = dims.x / pageSize.x;
    const frameWidth = frameSize * cm2px;
    const innerWidth = (qrCodeSize + qrCodeBorderSize * 2) * cm2px;
    const outerWidth = innerWidth + frameWidth * 2;
    const radiusWidth = frameRadius * cm2px;
    const textHeight = (textSize + textBorder * 2) * cm2px;
    const headerHeight = (headerSize + headerBorder * 2) * cm2px;
    const logoWidth = logoSize * cm2px;
    const logoBorderWidth = logoBorder * cm2px;

    // draw header
    ctx.fillStyle = "#4f46e5";
    drawRoundRect(
        ctx,
        pageCenter.x * cm2px - outerWidth / 2 + logoWidth + logoBorderWidth * 4,
        pageCenter.y * cm2px - outerWidth / 2 - headerHeight,
        outerWidth - logoWidth - logoBorderWidth * 4,
        headerHeight + frameWidth,
        radiusWidth
    );
    ctx.fillRect( // this is just to hide the rounded corner
        pageCenter.x * cm2px + outerWidth / 2 - frameWidth,
        pageCenter.y * cm2px - outerWidth / 2,
        frameWidth,
        frameWidth
    );
    // to create a rounded inner corner
    ctx.fillRect(
        pageCenter.x * cm2px - outerWidth / 2 + logoWidth - frameWidth + logoBorderWidth * 4,
        pageCenter.y * cm2px - outerWidth / 2 - frameWidth + 1,
        frameWidth,
        frameWidth
    );
    ctx.beginPath();
    ctx.moveTo(
        pageCenter.x * cm2px - outerWidth / 2 + logoWidth - frameWidth + logoBorderWidth * 4,
        pageCenter.y * cm2px - outerWidth / 2 - frameWidth
    );
    ctx.fillStyle = 'white';
    ctx.arc(
        pageCenter.x * cm2px - outerWidth / 2 + logoWidth - frameWidth + logoBorderWidth * 4,
        pageCenter.y * cm2px - outerWidth / 2 - frameWidth,
        radiusWidth,
        0,
        Math.PI / 2,
    );
    ctx.closePath();
    ctx.fill();

    // draw frame
    ctx.fillStyle = color;
    drawRoundRect(
        ctx,
        pageCenter.x * cm2px - outerWidth / 2,
        pageCenter.y * cm2px - outerWidth / 2,
        outerWidth,
        innerWidth + frameWidth + textHeight,
        radiusWidth
    );
    ctx.fillStyle = "#ffffff";
    drawRoundRect(
        ctx,
        pageCenter.x * cm2px - innerWidth / 2,
        pageCenter.y * cm2px - innerWidth / 2,
        innerWidth,
        innerWidth,
        radiusWidth * 0.3
    );

    // draw indico logo
    const logoScale = 2;
    ctx.drawImage(
        logo,
        pageCenter.x * cm2px - outerWidth / 2 + logoBorderWidth * 2 - (logoScale - 1) * logoWidth * 0.5,
        pageCenter.y * cm2px - outerWidth / 2 - logoWidth - logoBorderWidth - (logoScale - 1) * logoWidth * 0.5,
        logoWidth * logoScale,
        logoWidth * logoScale,
    );

    // draw artifact name
    ctx.fillStyle = "#ffffff";
    ctx.font = `${textSize * cm2px}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        name,
        pageCenter.x * cm2px,
        pageCenter.y * cm2px + innerWidth / 2 + textHeight / 2
    );

    // draw qr code type
    ctx.fillStyle = "#ffffff";
    ctx.font = `${textSize * cm2px}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        qrType,
        pageCenter.x * cm2px - outerWidth / 2 + logoWidth + logoBorderWidth * 4 + (outerWidth - logoWidth - logoBorderWidth * 4) / 2,
        pageCenter.y * cm2px - outerWidth / 2 - headerHeight * 0.5,
    );

    // draw qr code
    const qrCodeWidth = qrCodeSize * cm2px;
    const qrCode = getQRCode("type="+qrType.toLowerCase()+";id="+id, qrCodeWidth);
    const shift = {x: (dims.x - qrCodeWidth) / 2, y: (dims.y - qrCodeWidth) / 2};
    ctx.drawImage(qrCode, shift.x, shift.y);

    return canvas.toDataURL("image/png");
}

function drawRoundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function getQRCode(content, size=300) {
    var qr = new VanillaQR({
        url: content.toString(),
        size,
        colorLight: "#ffffff",
        colorDark: color,
        noBorder: true,
    });
    return qr.domElement;
}

function loadLogo() {
    return new Promise((resolve, reject) => {
        if (!logo.src) {
            logo.src = "/logo_indigo.png";
            logo.onload = () => resolve();
        } else {
            resolve();
        }
    });
}

function createDoc(id, name, qrType) {
    return new Promise((resolve, reject) => {
        const doc = new jsPDF();
        const dims = {x: 210 * 8, y: 297 * 8};

        loadLogo().then(() => {
            const img = createPDFImage(id, name, qrType, dims);
            doc.addImage(img, 'PNG', 0, 0, 210, 297);
            
            var blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
            var url = URL.createObjectURL(blob);
            const size = {x: 420, y: 594};
            const pos = {x: (window.innerWidth - size.x) / 2, y: (window.innerHeight - size.y) / 2, w: size.x, h: size.y};
            const win = window.open(url, '_blank', `left=${pos.x},top=${pos.y},width=${pos.w},height=${pos.h}`);
            win.focus();
            resolve();
        });
    });
}