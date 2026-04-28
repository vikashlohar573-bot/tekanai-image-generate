function generate() {
  let prompt = document.getElementById("prompt").value;

  if (!prompt) {
    alert("Enter prompt");
    return;
  }

  document.getElementById("loading").innerText = "Generating...";

  let finalPrompt = prompt + ", high quality, 4k";

  let imageUrl = "https://image.pollinations.ai/prompt/" + encodeURIComponent(finalPrompt);

  let img = document.getElementById("image");
  img.src = imageUrl;
  img.style.display = "block";

  document.getElementById("download").href = imageUrl;

  document.getElementById("loading").innerText = "";
}
