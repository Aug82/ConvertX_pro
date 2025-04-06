function convertImage() {
  const file = document.getElementById("imageInput").files[0];
  const format = document.getElementById("format").value;
  const quality = parseFloat(document.getElementById("quality").value);
  const resultDiv = document.getElementById("result");
  
  if (!file) {
    alert("Please upload an image file.");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      const mimeType = `image/${format}`;
      const convertedURL = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement("a");
      link.href = convertedURL;
      link.download = `converted.${format}`;
      link.textContent = "Download Converted Image";
      link.className = "neon-btn";
      
      resultDiv.innerHTML = "";
      resultDiv.appendChild(link);
    };
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}