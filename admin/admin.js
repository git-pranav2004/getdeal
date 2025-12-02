async function addProduct() {
  const p = {
    id: Date.now(),
    title: document.getElementById("title").value,
    image: document.getElementById("image").value,
    price: document.getElementById("price").value,
    description: document.getElementById("desc").value,
    category: document.getElementById("category").value,
    link: document.getElementById("link").value
  };

  const res = await fetch("products.json");
  const data = await res.json();
  data.push(p);

  const formatted = JSON.stringify(data, null, 2);
  document.getElementById("output").textContent = formatted;

  alert("✅ Product added successfully! Copy updated JSON below and replace products.json on GitHub.");
}

function copyJSON() {
  const output = document.getElementById("output").textContent;
  if (!output) return alert("No JSON data to copy!");
  navigator.clipboard.writeText(output);
  alert("📋 JSON copied to clipboard!");
}