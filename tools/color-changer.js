async function changeColors() {
  const fileInput = document.getElementById("pdfFile");
  const textColor = document.getElementById("textColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Please upload a PDF file.");
    return;
  }
  
  const output = document.getElementById("output");
  output.innerHTML = "Processing...";
  
  const fileReader = new FileReader();
  fileReader.onload = async function() {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    const { jsPDF } = window.jspdf;
    const newPDF = new jsPDF();
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = textColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (i !== 1) newPDF.addPage();
      newPDF.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    }
    
    const blob = newPDF.output("blob");
    const url = URL.createObjectURL(blob);
    
    output.innerHTML = `<a href="${url}" download="color-changed.pdf" class="neon-btn">Download PDF</a>`;
  };
  
  fileReader.readAsArrayBuffer(file);
}