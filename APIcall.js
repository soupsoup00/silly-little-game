let images = []
let round = 0

function getBase64FromPath(imagePath, callback) {
    fetch(imagePath)
        .then(response => response.blob()) // Convert to Blob
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); // Read Blob as Data URL
            reader.onloadend = function () {
                const dataURL = reader.result;
                const base64 = dataURL.split(',')[1]; // Extract Base64 part
                callback(base64);
            };
        })
        .catch(error => console.error('Error loading image:', error));
}
let base64_img
// Example usage
getBase64FromPath('yellowpup.png', async function (base64) {
    base64_img = base64
    base64_img = await resizeAndCompressBase64("data:image/jpeg;base64,"+base64_img)
    console.log(base64_img)
    askOpenAI(base64_img)
});
  async function askOpenAI(base64Image) {
    const apiKey = ""; // Never expose this in frontend!
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 500,
            messages: [
                { "role": "user", "content": [
                    { "type": "text", "text": "What is in this image?" },
                    { "type": "image_url", "image_url": { "url": base64Image } }
                ]}
            ]
        })
    });

    const data = await response.json();
    console.log(data);
    images[round] = data.choices[0].message.content
    console.log(images[round])
}

async function resizeAndCompressBase64(base64Str) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const targetSize = 512;
            canvas.width = targetSize;
            canvas.height = targetSize;

            // Draw the image to resize it
            ctx.drawImage(img, 0, 0, targetSize, targetSize);

            // Convert to JPEG with 70% quality
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
    });
}
