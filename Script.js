async function generate() {
  let prompt = document.getElementById("prompt").value;

  if (!prompt) {
    alert("Please enter something!");
    return;
  }

  document.getElementById("loading").innerText = "Generating image...";

  let imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;

  let img = document.getElementById("image");
  img.src = imageUrl;
  img.style.display = "block";

  document.getElementById("download").href = imageUrl;

  document.getElementById("loading").innerText = "";
}
