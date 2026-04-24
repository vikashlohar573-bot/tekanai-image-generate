async function generate() {
  let prompt = document.getElementById("prompt").value;

  let response = await fetch(`https://image.pollinations.ai/prompt/${prompt}`);
  
  document.getElementById("image").src = response.url;
}
