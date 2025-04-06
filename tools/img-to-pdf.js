async function convertImagesToPDF() {
  const files = document.getElementById("imageFiles").files;
  if (files.length === 0) {
    alert("Please select at least one image.");
    return;
  }
  
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "Processing...";
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    await new Promise((resolve) => {
      img.onload = () => {
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (img.height * imgWidth) / img.width;
        
        if (i !== 0) pdf.addPage();
        pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
        resolve();
      };
    });
  }
  
  const pdfBlob = pdf.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);
  
  outputDiv.innerHTML = `
    <a href="${pdfURL}" download="converted.pdf" class="neon-btn">Download PDF</a>
  `;
}