async function convertPDF() {
  const fileInput = document.getElementById("pdfFile");
  const file = fileInput.files[0];

  if (!file || file.type !== "application/pdf") {
    alert("Please select a valid PDF file.");
    return;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "Processing...";

  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    outputDiv.innerHTML = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const scale = 2;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.style.margin = "20px 0";
      img.style.maxWidth = "90%";

      outputDiv.appendChild(img);

      const downloadLink = document.createElement("a");
      downloadLink.href = img.src;
      downloadLink.download = `page-${pageNum}.png`;
      downloadLink.textContent = `Download Page ${pageNum}`;
      downloadLink.className = "neon-btn";
      downloadLink.style.display = "block";
      downloadLink.style.marginBottom = "20px";

      outputDiv.appendChild(downloadLink);
    }
  };

  fileReader.readAsArrayBuffer(file);
}